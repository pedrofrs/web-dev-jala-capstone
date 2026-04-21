import { useState } from 'react';
import { Book } from '../lib/data';
import { StatusBadge } from './StatusBadge';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';
import { MapPin, Download, BookOpen, Heart, BookMarked } from 'lucide-react';
import {
  isInLibrary,
  isInWishlist,
  toggleLibrary,
  toggleWishlist,
} from '../services/localStorageService';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();
  const [inLibrary, setInLibrary] = useState(() => isInLibrary(book.id));
  const [inWishlist, setInWishlist] = useState(() => isInWishlist(book.id));

  function handleLibrary(e: React.MouseEvent) {
    e.stopPropagation();
    setInLibrary(toggleLibrary(book));
  }

  function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    setInWishlist(toggleWishlist(book));
  }

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

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 gap-1.5 text-xs ${inLibrary ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary' : ''}`}
            onClick={handleLibrary}
            title={inLibrary ? 'Remover da Minha Biblioteca' : 'Adicionar à Minha Biblioteca'}
          >
            <BookMarked className="w-3.5 h-3.5" />
            {inLibrary ? 'Na Biblioteca' : 'Biblioteca'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 gap-1.5 text-xs ${inWishlist ? 'bg-rose-500 text-white hover:bg-rose-600 border-rose-500' : ''}`}
            onClick={handleWishlist}
            title={inWishlist ? 'Remover da Wishlist' : 'Adicionar à Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
            {inWishlist ? 'Na Wishlist' : 'Wishlist'}
          </Button>
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
        <div className="flex gap-2 pt-1">
          <div className="h-8 bg-muted animate-pulse rounded flex-1" />
          <div className="h-8 bg-muted animate-pulse rounded flex-1" />
        </div>
      </div>
    </Card>
  );
}
