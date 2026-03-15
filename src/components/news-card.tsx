"use client";

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ExternalLink, Calendar, Globe } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface NewsCardProps {
  article: {
    id: string;
    title: string;
    summary: string;
    url: string;
    image_url: string | null;
    source: string;
    published_at: string;
    category: string;
    language: string;
  };
}

export function NewsCard({ article }: NewsCardProps) {
  const summary = article.summary || "";
  const title = article.title || "";
  const isCarbonRelated = summary.toLowerCase().includes('karbon') || title.toLowerCase().includes('karbon');

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={title}
            fill
            className="h-full w-full object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary/40">
            <Globe className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground">
            {article.category}
          </Badge>
          {isCarbonRelated && (
            <Badge variant="default" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Karbon Tasarrufu
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
          <span className="font-semibold text-primary">{article.source}</span>
          <span>•</span>
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDistanceToNow(new Date(article.published_at), { addSuffix: true, locale: tr })}
          </div>
        </div>
        <h3 className="line-clamp-2 text-lg font-bold leading-tight group-hover:text-primary transition-colors">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {article.summary || "Özet bulunamadı."}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }), 
            "ml-auto text-primary hover:text-primary/80 hover:bg-primary/10 p-2 flex items-center h-auto transition-colors"
          )}
        >
          Devamını Oku
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </CardFooter>
    </Card>
  );
}
