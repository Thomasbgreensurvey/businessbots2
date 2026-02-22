CREATE TABLE public.content_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic text NOT NULL,
  featured_agent text NOT NULL DEFAULT 'Sprout',
  status text NOT NULL DEFAULT 'queued',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  result_post_id uuid REFERENCES public.blog_posts(id)
);

ALTER TABLE public.content_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read content queue" ON public.content_queue FOR SELECT USING (true);
CREATE POLICY "Anyone can insert content queue" ON public.content_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update content queue" ON public.content_queue FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete content queue" ON public.content_queue FOR DELETE USING (true);