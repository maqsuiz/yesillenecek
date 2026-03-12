"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FiltersProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  activeTimeframe: string;
  setActiveTimeframe: (timeframe: string) => void;
}

const categories = [
  'Tümü',
  'Sürdürülebilirlik',
  'İklim',
  'Karbon',
  'Doğa Yeşillenmesi'
];

const timeframes = [
  { id: '7d', label: 'Son 7 Gün' },
  { id: '30d', label: 'Son 30 Gün' },
  { id: 'all', label: 'Tüm Zamanlar' },
];

export function Filters({ 
  activeCategory, 
  setActiveCategory, 
  activeTimeframe, 
  setActiveTimeframe 
}: FiltersProps) {
  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className={activeCategory === cat ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {cat}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center space-x-4 overflow-x-auto pb-2 sm:pb-0">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Zaman Aralığı:</span>
        <div className="flex bg-muted p-1 rounded-lg">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setActiveTimeframe(tf.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeTimeframe === tf.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
