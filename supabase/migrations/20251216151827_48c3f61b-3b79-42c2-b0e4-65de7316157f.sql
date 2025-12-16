-- Create demo_bookings table
CREATE TABLE public.demo_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a booking request
CREATE POLICY "Anyone can submit demo booking"
ON public.demo_bookings
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can view bookings
CREATE POLICY "Authenticated users can view bookings"
ON public.demo_bookings
FOR SELECT
USING (auth.role() = 'authenticated');