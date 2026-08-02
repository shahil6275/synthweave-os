import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Download,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldAlert,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuroraBackdrop } from "@/components/aios/primitives";

type ConsentFilter = "all" | "granted" | "missing";
type SortKey = "email" | "source" | "consent" | "consent_at" | "created_at";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "email", label: "Email" },
  { key: "source", label: "Source" },
  { key: "consent", label: "Consent" },
  { key: "consent_at", label: "Consent at" },
  { key: "created_at", label: "Captured" },
];

type Lead = {
  id: string;
  email: string;
  source: string;
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
  const header = ["email", "source", "consent", "consent_at", "created_at"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.email, r.source, r.consent ? "yes" : "no", r.consent_at ?? "", r.created_at]
      .map((v) => escape(String(v)))
      .join(","),
  );
  return [header.join(","), ...lines].join("\r\n");
}

function AdminLeadsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [consentFilter, setConsentFilter] = useState<ConsentFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);


  const leadsQuery = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, email, source, consent, consent_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
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

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "created_at" || key === "consent_at" ? "desc" : "asc");
    }
  };


  const handleExport = () => {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aios-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
                <table className="w-full min-w-[46rem] text-left text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
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
                      <tr key={lead.id} className="border-t border-border/60">
                        <td className="px-6 py-4 text-foreground">{lead.email}</td>
                        <td className="px-6 py-4 text-muted-foreground">{lead.source}</td>
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

      </div>
    </main>
  );
}
