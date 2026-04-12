import React from 'react';
import { Heart } from 'lucide-react';
import { mockUserBooks } from '../lib/data';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router';

export default function Wishlist() {
  const navigate = useNavigate();
  const wishlistBooks = mockUserBooks.filter(
    (ub) => ub.readingStatus === 'wishlist'
  );

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-secondary">Wishlist</h1>
        <p className="text-muted-foreground">
          Books you want to read • {wishlistBooks.length} books
        </p>
      </div>

      {wishlistBooks.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg">
          <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-bold text-secondary mb-2">
            No Books in Wishlist
          </h3>
          <p className="text-muted-foreground mb-4">
            Start adding books to your wishlist to keep track of what you want
            to read.
          </p>
          <Button onClick={() => navigate('/')}>Browse Books</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistBooks.map((userBook) => {
            const book = userBook.book;
            const isAvailable = book.status === 'available';

            return (
              <Card
                key={userBook.bookId}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <div className="aspect-[2/3] relative overflow-hidden bg-muted">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  {isAvailable && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-success text-success-foreground">
                        Available Now!
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-secondary line-clamp-2 min-h-[3rem]">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {book.author}
                  </p>
                  <Button className="w-full mt-2" disabled={!isAvailable}>
                    {isAvailable ? 'Borrow Now' : 'Not Available'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
