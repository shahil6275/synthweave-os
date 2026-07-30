ALTER TABLE public.leads
  ADD COLUMN consent boolean NOT NULL DEFAULT false,
  ADD COLUMN consent_at timestamptz;

DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

CREATE POLICY "Anyone can submit a lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(email) >= 3
  AND char_length(email) <= 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND source = 'footer'
  AND consent = true
  AND consent_at IS NOT NULL
);