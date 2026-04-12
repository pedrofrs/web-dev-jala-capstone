import { Book } from '../lib/data';
import { StatusBadge } from './StatusBadge';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { useNavigate } from 'react-router';
import { MapPin, Download, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={() => navigate(`/book/${book.id}`)}
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-muted">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover"
        />
        {book.availabilityType === 'digital' && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-secondary text-secondary-foreground gap-1">
              <Download className="w-3 h-3" />
              Digital
            </Badge>
          </div>
        )}
        {book.availabilityType === 'both' && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary text-primary-foreground gap-1">
              <BookOpen className="w-3 h-3" />
              Both
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-h-[3rem]">{book.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        
        {/* Shelf Location with monospace font */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <code className="font-mono font-medium">{book.shelfLocation}</code>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Badge variant="outline" className="text-xs">
            {book.category}
          </Badge>
          <StatusBadge status={book.status} />
        </div>
      </div>
    </Card>
  );
}

export function BookCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[2/3] bg-muted animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
        <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
        <div className="flex items-center gap-2 pt-2">
          <div className="h-6 bg-muted animate-pulse rounded w-16" />
          <div className="h-6 bg-muted animate-pulse rounded w-20" />
        </div>
      </div>
    </Card>
  );
}