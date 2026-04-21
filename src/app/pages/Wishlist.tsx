import React, { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Book } from '../lib/data';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router';
import { getWishlist, removeFromWishlist } from '../services/localStorageService';

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistBooks, setWishlistBooks] = useState<Book[]>([]);

  useEffect(() => {
    setWishlistBooks(getWishlist());
  }, []);

  function handleRemove(bookId: string) {
    removeFromWishlist(bookId);
    setWishlistBooks((prev) => prev.filter((b) => b.id !== bookId));
  }

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-secondary">Wishlist</h1>
        <p className="text-muted-foreground">
          Books you want to read •{' '}
          {wishlistBooks.length === 1
            ? '1 book'
            : `${wishlistBooks.length} books`}
        </p>
      </div>

      {wishlistBooks.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg">
          <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-bold text-secondary mb-2">No Books in Wishlist</h3>
          <p className="text-muted-foreground mb-4">
            Start adding books to your wishlist to keep track of what you want to read.
          </p>
          <Button onClick={() => navigate('/')}>Browse Books</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistBooks.map((book) => (
            <Card
              key={book.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div
                className="aspect-[2/3] relative overflow-hidden bg-muted cursor-pointer"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                {book.status === 'available' && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-success text-success-foreground">
                      Available Now!
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3
                  className="font-bold text-secondary line-clamp-2 min-h-[3rem] cursor-pointer hover:text-primary"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <Badge variant="outline" className="text-xs">
                  {book.category}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 mt-2"
                  onClick={() => handleRemove(book.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remover da Wishlist
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
