import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ExternalLink, Calendar, Globe } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  const isCarbonRelated = article.summary.toLowerCase().includes('karbon') || article.title.toLowerCase().includes('karbon');

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1470115636492-6d2b51253b36?q=80&w=1000&auto=format&fit=crop';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-green-50 text-green-200">
            <Globe className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {article.category}
          </Badge>
          {isCarbonRelated && (
            <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
              Karbon Tasarrufu
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
          <span className="font-semibold text-green-600">{article.source}</span>
          <span>•</span>
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDistanceToNow(new Date(article.published_at), { addSuffix: true, locale: tr })}
          </div>
        </div>
        <h3 className="line-clamp-2 text-lg font-bold leading-tight group-hover:text-green-600">
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
        <Button variant="ghost" size="sm" asChild className="ml-auto text-green-600 hover:text-green-700 hover:bg-green-50 p-0">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
            Devamını Oku
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
