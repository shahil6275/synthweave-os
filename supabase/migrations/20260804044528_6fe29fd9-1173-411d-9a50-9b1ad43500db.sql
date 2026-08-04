DO $$ BEGIN
  CREATE TYPE public.lead_status AS ENUM ('new','contacted','qualified','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS status public.lead_status NOT NULL DEFAULT 'new';

CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));