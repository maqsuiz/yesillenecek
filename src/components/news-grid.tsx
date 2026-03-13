"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { NewsCard } from './news-card';
import { Filters } from './filters';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

export function NewsGrid() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [activeTimeframe, setActiveTimeframe] = useState('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = useCallback(async (isInitial = false) => {
    setLoading(true);
    let query = supabase
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false });

    // Handle range based on page
    const from = isInitial ? 0 : page * 12;
    const to = isInitial ? 11 : (page + 1) * 12 - 1;
    query = query.range(from, to);

    if (activeCategory !== 'Tümü') {
      query = query.eq('category', activeCategory);
    }

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    const now = new Date();
    if (activeTimeframe === '7d') {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();
      query = query.gte('published_at', sevenDaysAgo);
    } else if (activeTimeframe === '30d') {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30)).toISOString();
      query = query.gte('published_at', thirtyDaysAgo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
    } else {
      if (isInitial) {
        setArticles(data || []);
      } else {
        setArticles((prev) => [...prev, ...(data || [])]);
      }
      setHasMore(data?.length === 12);
    }
    setLoading(false);
  }, [activeCategory, activeTimeframe, searchQuery, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchArticles(page === 0);
  }, [fetchArticles, page]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      !loading &&
      hasMore
    ) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(0);
  }, [activeCategory, activeTimeframe, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Sürdürülebilirlik Nabzı</h1>
          <p className="text-muted-foreground">Dünyadan ve Türkiye&apos;den en güncel yeşil haberler.</p>
        </div>
        <div className="md:hidden relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Ara..."
            className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Filters
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeTimeframe={activeTimeframe}
        setActiveTimeframe={setActiveTimeframe}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
        {loading && Array.from({ length: 4 }).map((_, i) => (
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

      {hasMore && !loading && (
        <div className="flex justify-center mt-12">
            <button 
                onClick={() => setPage(prev => prev + 1)}
                className="text-green-600 hover:text-green-700 font-medium"
            >
                Daha Fazla Yükle
            </button>
        </div>
      )}
    </div>
  );
}
