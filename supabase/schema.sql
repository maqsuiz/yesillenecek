-- Create news_articles table
create table if not exists public.news_articles (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    summary text,
    url text unique not null,
    image_url text,
    source text,
    published_at timestamptz default now(),
    category text,
    language text,
    created_at timestamptz default now()
);

-- Index for faster querying by published_at
create index if not exists news_articles_published_at_idx on public.news_articles (published_at desc);

-- Index for searching (optional but recommended)
create index if not exists news_articles_title_idx on public.news_articles using gin (to_tsvector('turkish', title));

-- Enable Row Level Security (RLS)
alter table public.news_articles enable row level security;

-- Allow anonymous read access
create policy "Allow public read access" on public.news_articles
    for select using (true);
