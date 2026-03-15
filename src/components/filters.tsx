"use client";

import { Button } from '@/components/ui/button';

interface FiltersProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const categories = [
  'Tümü',
  'Sürdürülebilirlik',
  'İklim',
  'Karbon',
  'Doğa Yeşillenmesi'
];

export function Filters({ 
  activeCategory, 
  setActiveCategory
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
            className={activeCategory === cat ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
