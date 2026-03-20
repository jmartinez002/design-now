-- Run this query in your Supabase SQL Editor to create the submissions table

CREATE TABLE submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  portfolio_link text NOT NULL,
  message text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (since the submission form is open to anyone)
CREATE POLICY "Allow public inserts on submissions"
ON submissions FOR INSERT TO anon
WITH CHECK (true);

-- Allow authenticated users to view submissions (optional)
CREATE POLICY "Allow read access for authenticated users"
ON submissions FOR SELECT TO authenticated
USING (true);
