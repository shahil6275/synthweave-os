import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Download,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldAlert,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuroraBackdrop } from "@/components/aios/primitives";

type ConsentFilter = "all" | "granted" | "missing";
type SortKey = "email" | "source" | "status" | "consent" | "consent_at" | "created_at";
type SortDir = "asc" | "desc";
type LeadStatus = "new" | "contacted" | "qualified" | "archived";

const PAGE_SIZE = 10;

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "archived"];

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-primary/15 text-primary ring-primary/40",
  contacted: "bg-accent/15 text-accent ring-accent/40",
  qualified: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/40",
  archived: "bg-muted/40 text-muted-foreground ring-border",
};

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "email", label: "Email" },
  { key: "source", label: "Source" },
  { key: "status", label: "Status" },
  { key: "consent", label: "Consent" },
  { key: "consent_at", label: "Consent at" },
  { key: "created_at", label: "Captured" },
];

type Lead = {
  id: string;
  email: string;
  source: string;
  status: LeadStatus;
  consent: boolean;
  consent_at: string | null;
  created_at: string;
};


export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: AdminLeadsPage,
  head: () => ({
    meta: [
      { title: "Lead management — AIOS Admin" },
      {
        name: "description",
        content: "Search, filter by GDPR consent and export AIOS newsletter leads to CSV.",
      },
      { property: "og:title", content: "Lead management — AIOS Admin" },
      {
        property: "og:description",
        content: "Search, filter by GDPR consent and export AIOS newsletter leads to CSV.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function toCsv(rows: Lead[]) {
  const header = ["email", "source", "status", "consent", "consent_at", "created_at"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.email, r.source, r.status, r.consent ? "yes" : "no", r.consent_at ?? "", r.created_at]
      .map((v) => escape(String(v)))
      .join(","),
  );
  return [header.join(","), ...lines].join("\r\n");
}

function downloadCsv(rows: Lead[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aios-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function AdminLeadsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [consentFilter, setConsentFilter] = useState<ConsentFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [bulkBusy, setBulkBusy] = useState<null | "delete" | "status">(null);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openDrawer = (lead: Lead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedLead(null), 300);
  };

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  const leadsQuery = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, email, source, status, consent, consent_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });

  const leads = leadsQuery.data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (consentFilter === "granted" && !l.consent) return false;
      if (consentFilter === "missing" && l.consent) return false;
      if (!q) return true;
      return l.email.toLowerCase().includes(q) || l.source.toLowerCase().includes(q);
    });
  }, [leads, query, consentFilter]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "boolean" || typeof bv === "boolean") {
        return ((av ? 1 : 0) - (bv ? 1 : 0)) * dir;
      }
      const as = (av ?? "") as string;
      const bs = (bv ?? "") as string;
      if (as === bs) return 0;
      if (as === "") return 1;
      if (bs === "") return -1;
      return as.localeCompare(bs, undefined, { numeric: true }) * dir;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(
    () => sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [sorted, currentPage],
  );

  useEffect(() => {
    setPage(1);
  }, [query, consentFilter, sortKey, sortDir]);

  // Drop selections for rows that no longer exist or are filtered out.
  useEffect(() => {
    const visible = new Set(filtered.map((l) => l.id));
    setSelectedIds((prev) => {
      const next = prev.filter((id) => visible.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, [filtered]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedLeads = useMemo(
    () => sorted.filter((l) => selectedSet.has(l.id)),
    [sorted, selectedSet],
  );

  const toggleOne = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const pageIds = paged.map((l) => l.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedSet.has(id));

  const togglePage = () =>
    setSelectedIds((prev) =>
      allPageSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...prev, ...pageIds])),
    );

  const clearSelection = () => {
    setSelectedIds([]);
    setStatusMenuOpen(false);
    setConfirmDelete(false);
    setBulkError(null);
  };

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "created_at" || key === "consent_at" ? "desc" : "asc");
    }
  };


  const handleExport = () => downloadCsv(sorted);

  const handleBulkExport = () => downloadCsv(selectedLeads);

  const handleBulkStatus = async (status: LeadStatus) => {
    setBulkBusy("status");
    setBulkError(null);
    setStatusMenuOpen(false);
    const { error } = await supabase.from("leads").update({ status }).in("id", selectedIds);
    setBulkBusy(null);
    if (error) {
      setBulkError("Couldn't update status. Admin access is required.");
      return;
    }
    await leadsQuery.refetch();
    setSelectedLead((prev) =>
      prev && selectedSet.has(prev.id) ? { ...prev, status } : prev,
    );
    clearSelection();
  };

  const handleBulkDelete = async () => {
    setBulkBusy("delete");
    setBulkError(null);
    const { error } = await supabase.from("leads").delete().in("id", selectedIds);
    setBulkBusy(null);
    if (error) {
      setBulkError("Couldn't delete leads. Admin access is required.");
      return;
    }
    if (selectedLead && selectedSet.has(selectedLead.id)) closeDrawer();
    await leadsQuery.refetch();
    clearSelection();
  };

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const isForbidden =
    !leadsQuery.isLoading && !leadsQuery.isError && leads.length === 0 && !query;

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-16">
      <AuroraBackdrop className="opacity-40" />

      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              AIOS Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
              Lead management
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {leadsQuery.isLoading
                ? "Loading records…"
                : `${filtered.length} of ${leads.length} leads shown`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => leadsQuery.refetch()}
              className="glass flex h-11 items-center gap-2 rounded-full px-5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <RefreshCw className={`size-4 ${leadsQuery.isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="glass flex h-11 items-center gap-2 rounded-full px-5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </header>

        <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <label htmlFor="lead-search" className="sr-only">
              Search leads
            </label>
            <input
              id="lead-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by email or source"
              className="h-12 w-full rounded-full border border-input bg-secondary/40 pl-12 pr-5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
            />
          </div>

          <div
            role="group"
            aria-label="Filter by GDPR consent"
            className="glass flex h-12 items-center gap-1 rounded-full p-1"
          >
            {(
              [
                ["all", "All"],
                ["granted", "Consent given"],
                ["missing", "No consent"],
              ] as [ConsentFilter, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={consentFilter === value}
                onClick={() => setConsentFilter(value)}
                className={`h-10 rounded-full px-4 text-xs transition-colors ${
                  consentFilter === value
                    ? "bg-primary/25 text-foreground ring-1 ring-primary/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Download className="size-4" />
            Export CSV
          </button>
        </div>

        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="glass-strong mt-4 flex flex-wrap items-center gap-3 rounded-[1.25rem] px-5 py-4"
              role="region"
              aria-label="Bulk actions"
            >
              <p className="text-sm text-foreground">
                {selectedIds.length} selected
              </p>
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Clear
              </button>

              <div className="ml-auto flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleBulkExport}
                  className="glass flex h-10 items-center gap-2 rounded-full px-4 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Download className="size-4" />
                  Export selected
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStatusMenuOpen((o) => !o)}
                    aria-haspopup="menu"
                    aria-expanded={statusMenuOpen}
                    disabled={bulkBusy !== null}
                    className="glass flex h-10 items-center gap-2 rounded-full px-4 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    {bulkBusy === "status" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Tag className="size-4" />
                    )}
                    Set status
                  </button>
                  <AnimatePresence>
                    {statusMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        role="menu"
                        className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-2xl border border-border/60 bg-background/95 p-1 shadow-2xl backdrop-blur-xl"
                      >
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            role="menuitem"
                            onClick={() => handleBulkStatus(s)}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs capitalize text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                          >
                            <span
                              className={`size-2 rounded-full ring-1 ${STATUS_STYLES[s]}`}
                              aria-hidden="true"
                            />
                            {s}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleBulkDelete}
                      disabled={bulkBusy !== null}
                      className="flex h-10 items-center gap-2 rounded-full bg-destructive px-4 text-xs font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {bulkBusy === "delete" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      Confirm delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="glass flex h-10 items-center rounded-full px-4 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    disabled={bulkBusy !== null}
                    className="flex h-10 items-center gap-2 rounded-full bg-destructive/15 px-4 text-xs text-destructive ring-1 ring-destructive/40 transition-colors hover:bg-destructive/25 disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </button>
                )}
              </div>

              {bulkError && (
                <p role="alert" className="w-full text-xs text-destructive">
                  {bulkError}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass-strong mt-8 overflow-hidden rounded-[1.5rem]">
          {leadsQuery.isLoading ? (
            <div className="flex items-center justify-center gap-2 p-16 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading leads…
            </div>
          ) : leadsQuery.isError ? (
            <div className="flex flex-col items-center gap-2 p-16 text-center text-sm text-muted-foreground">
              <ShieldAlert className="size-5 text-destructive" />
              Couldn&apos;t load leads. You may not have admin access.
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-16 text-center text-sm text-muted-foreground">
              <ShieldAlert className="size-5" />
              {isForbidden
                ? "No leads visible. Only admin accounts can read lead records."
                : "No leads match your filters."}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[52rem] text-left text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      <th scope="col" className="px-6 py-4 font-normal">
                        <input
                          type="checkbox"
                          checked={allPageSelected}
                          onChange={togglePage}
                          aria-label="Select all leads on this page"
                          className="size-4 cursor-pointer accent-[oklch(var(--primary))] align-middle"
                        />
                      </th>
                      {COLUMNS.map((col) => {
                        const active = sortKey === col.key;
                        const Icon = !active ? ChevronsUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
                        return (
                          <th
                            key={col.key}
                            scope="col"
                            className="px-6 py-4 font-normal"
                            aria-sort={
                              active ? (sortDir === "asc" ? "ascending" : "descending") : "none"
                            }
                          >
                            <button
                              type="button"
                              onClick={() => toggleSort(col.key)}
                              className={`flex items-center gap-1.5 uppercase tracking-[0.18em] transition-colors hover:text-foreground ${
                                active ? "text-foreground" : ""
                              }`}
                            >
                              {col.label}
                              <Icon className={`size-3 ${active ? "" : "opacity-50"}`} />
                            </button>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((lead) => (
                      <tr
                        key={lead.id}
                        onClick={() => openDrawer(lead)}
                        role="button"
                        tabIndex={0}
                        aria-label={`View details for ${lead.email}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openDrawer(lead);
                          }
                        }}
                        className={`border-t border-border/60 cursor-pointer transition-colors hover:bg-primary/5 focus:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30 ${
                          selectedSet.has(lead.id) ? "bg-primary/10" : ""
                        }`}
                      >
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedSet.has(lead.id)}
                            onChange={() => toggleOne(lead.id)}
                            aria-label={`Select ${lead.email}`}
                            className="size-4 cursor-pointer accent-[oklch(var(--primary))] align-middle"
                          />
                        </td>
                        <td className="px-6 py-4 text-foreground">{lead.email}</td>
                        <td className="px-6 py-4 text-muted-foreground">{lead.source}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs capitalize ring-1 ${STATUS_STYLES[lead.status]}`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs ring-1 ${
                              lead.consent
                                ? "bg-accent/15 text-accent ring-accent/40"
                                : "bg-destructive/10 text-destructive ring-destructive/40"
                            }`}
                          >
                            {lead.consent ? "Granted" : "Missing"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {formatDate(lead.consent_at)}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {formatDate(lead.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <nav
                aria-label="Lead table pagination"
                className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-6 py-4 text-sm text-muted-foreground"
              >
                <p>
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, sorted.length)} of {sorted.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="glass flex h-9 items-center gap-1 rounded-full px-4 text-xs transition-colors hover:text-foreground disabled:opacity-40"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </button>
                  <span className="px-2 text-xs">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="glass flex h-9 items-center gap-1 rounded-full px-4 text-xs transition-colors hover:text-foreground disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </nav>
            </>
          )}
        </div>

        <AnimatePresence>
          {drawerOpen && selectedLead && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                onClick={closeDrawer}
                aria-hidden="true"
              />
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border/60 bg-background/90 p-8 shadow-2xl backdrop-blur-xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="lead-details-title"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        Lead details
                      </p>
                      <h2
                        id="lead-details-title"
                        className="mt-2 text-2xl font-semibold tracking-[-0.02em] break-all"
                      >
                        {selectedLead.email}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="glass flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Close lead details"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <div className="mt-8 flex-1 space-y-6 overflow-y-auto">
                    <DetailItem label="Email" value={selectedLead.email} />
                    <DetailItem label="Source" value={selectedLead.source} />
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Status
                      </dt>
                      <dd className="mt-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs capitalize ring-1 ${STATUS_STYLES[selectedLead.status]}`}
                        >
                          {selectedLead.status}
                        </span>
                      </dd>
                    </div>
                    <DetailItem
                      label="GDPR consent"
                      value={selectedLead.consent ? "Granted" : "Missing"}
                      badge
                      badgeType={selectedLead.consent ? "success" : "error"}
                    />
                    <DetailItem
                      label="Consent timestamp"
                      value={formatDate(selectedLead.consent_at)}
                    />
                    <DetailItem
                      label="Captured"
                      value={formatDate(selectedLead.created_at)}
                    />
                    <DetailItem label="Lead ID" value={selectedLead.id} mono />
                  </div>

                  <div className="mt-6 border-t border-border/60 pt-6">
                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Close details
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function DetailItem({
  label,
  value,
  mono,
  badge,
  badgeType,
}: {
  label: string;
  value: string;
  mono?: boolean;
  badge?: boolean;
  badgeType?: "success" | "error";
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-2">
        {badge ? (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs ring-1 ${
              badgeType === "success"
                ? "bg-accent/15 text-accent ring-accent/40"
                : "bg-destructive/10 text-destructive ring-destructive/40"
            }`}
          >
            {value}
          </span>
        ) : (
          <span
            className={`text-sm text-foreground ${
              mono ? "break-all font-mono text-xs text-muted-foreground" : ""
            }`}
          >
            {value}
          </span>
        )}
      </dd>
    </div>
  );
}
