import React from 'react';
import { Button } from './button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(i)}
            className={cn(
              "w-9 h-9 p-0",
              currentPage === i ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Logic for ellipsis if many pages
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(1)}
          className={cn("w-9 h-9 p-0", currentPage === 1 ? "bg-primary text-primary-foreground" : "")}
        >
          1
        </Button>
      );

      if (currentPage > 3) {
        pages.push(<span key="ellipsis-1" className="flex items-center justify-center w-9"><MoreHorizontal className="h-4 w-4" /></span>);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i === 1 || i === totalPages) continue;
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(i)}
            className={cn("w-9 h-9 p-0", currentPage === i ? "bg-primary text-primary-foreground" : "")}
          >
            {i}
          </Button>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(<span key="ellipsis-2" className="flex items-center justify-center w-9"><MoreHorizontal className="h-4 w-4" /></span>);
      }

      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(totalPages)}
          className={cn("w-9 h-9 p-0", currentPage === totalPages ? "bg-primary text-primary-foreground" : "")}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <nav className={cn("flex items-center justify-end space-x-2 mt-12", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="gap-1 pl-2.5"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Geri</span>
      </Button>
      
      <div className="flex items-center space-x-1">
        {renderPageNumbers()}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="gap-1 pr-2.5"
      >
        <span>İleri</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
