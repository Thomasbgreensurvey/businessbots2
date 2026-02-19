
-- Create blog-images storage bucket (public for featured images)
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Allow anyone to view blog images
CREATE POLICY "Blog images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Allow anyone to upload blog images (admin-only enforced by PIN at app level)
CREATE POLICY "Anyone can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images');

-- Allow anyone to update blog images
CREATE POLICY "Anyone can update blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images');

-- Allow anyone to delete blog images
CREATE POLICY "Anyone can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images');
