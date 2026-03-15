"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { NewsCard } from './news-card';
import { Filters } from './filters';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { Pagination } from './ui/pagination';

export function NewsGrid() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setErrorState(null);
    
    if (!supabase) {
      setErrorState('Veritabanı bağlantısı kurulamadı. Lütfen Supabase API anahtarlarınızı (Environment Variables) kontrol edin.');
      setLoading(false);
      return;
    }

    let query = supabase
      .from('news_articles')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false });

    // Handle range based on page
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;
    query = query.range(from, to);

    if (activeCategory !== 'Tümü') {
      query = query.eq('category', activeCategory);
    }

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
    } else {
      setArticles(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }, [activeCategory, searchQuery, page]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Sürdürülebilirlik Nabzı</h1>
          <p className="text-muted-foreground">Dünyadan ve Türkiye&apos;den en güncel yeşil haberler.</p>
        </div>
        <div className="relative md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Ara..."
            className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <Filters
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        
        {!loading && articles.length > 0 && (
          <div className="flex justify-end mb-8 md:mb-0">
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={handlePageChange}
              className="mt-0"
            />
          </div>
        )}
      </div>

      {errorState && (
        <div className="mb-8 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-center">
          <p className="font-medium">{errorState}</p>
          <p className="text-sm mt-1 opacity-80">
            Vercel Dashboard üzerinde <code className="bg-destructive/10 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> ve <code className="bg-destructive/10 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ortam değişkenlerinin ayarlandığından emin olun.
          </p>
        </div>
      )}

      {!errorState && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
            {loading && Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>

          {!loading && articles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Aradığınız kriterlere uygun haber bulunamadı.</p>
            </div>
          )}

          {!loading && articles.length > 0 && (
            <div className="flex justify-end mt-12">
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={handlePageChange}
                className="mt-0"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
