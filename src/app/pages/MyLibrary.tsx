import React, { useState } from 'react';
import { BookOpen, Calendar, CheckCircle2, Clock, Heart, User, Mail, GraduationCap, ListOrdered } from 'lucide-react';
import { mockLoans, mockUserBooks, mockStudent, mockReservations } from '../lib/data';
import { FinesWidget } from '../components/FinesWidget';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useNavigate } from 'react-router';

export default function MyLibrary() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('loans');

  const activeLoans = mockLoans.filter((loan) => loan.status === 'active' || loan.status === 'overdue');
  const loanHistory = mockLoans.filter((loan) => loan.status === 'returned');
  const wishlistBooks = mockUserBooks.filter((ub) => ub.readingStatus === 'wishlist');
  const readingBooks = mockUserBooks.filter((ub) => ub.readingStatus === 'reading');

  const getDaysRemaining = (returnDate: string) => {
    const due = new Date(returnDate);
    const today = new Date('2026-03-07');
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Student Identity Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-secondary">{mockStudent.name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <code className="font-mono font-medium">{mockStudent.id}</code>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  <span>{mockStudent.email}</span>
                </div>
              </div>
              <Badge variant="outline" className="mt-2">
                {mockStudent.department}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Fines Widget */}
      <FinesWidget student={mockStudent} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="loans">
            <BookOpen className="w-4 h-4 mr-2" />
            Current Loans
          </TabsTrigger>
          <TabsTrigger value="reservations">
            <ListOrdered className="w-4 h-4 mr-2" />
            Reservations
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="wishlist">
            <Heart className="w-4 h-4 mr-2" />
            Wishlist
          </TabsTrigger>
        </TabsList>

        {/* Current Loans Tab */}
        <TabsContent value="loans" className="space-y-6 mt-8">
          {activeLoans.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-bold text-secondary mb-2">No Active Loans</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any books currently borrowed.
              </p>
              <Button onClick={() => navigate('/')}>Browse Books</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeLoans.map((loan) => {
                const daysRemaining = getDaysRemaining(loan.returnDate);
                const isOverdue = loan.status === 'overdue';

                return (
                  <Card key={loan.id} className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div
                        className="w-32 h-48 flex-shrink-0 rounded overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/book/${loan.book.id}`)}
                      >
                        <img
                          src={loan.book.coverUrl}
                          alt={loan.book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h3
                            className="text-xl font-bold text-secondary cursor-pointer hover:text-primary"
                            onClick={() => navigate(`/book/${loan.book.id}`)}
                          >
                            {loan.book.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {loan.book.author}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                            <span>Shelf:</span>
                            <code className="font-mono font-medium">{loan.book.shelfLocation}</code>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Reading Progress
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {readingBooks.find(
                                (rb) => rb.bookId === loan.book.id
                              )?.progress || 0}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              readingBooks.find(
                                (rb) => rb.bookId === loan.book.id
                              )?.progress || 0
                            }
                            className="h-2"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>
                                Return:{' '}
                                {new Date(loan.returnDate).toLocaleDateString()}
                              </span>
                            </div>
                            <Badge
                              className={
                                isOverdue
                                  ? 'bg-destructive text-destructive-foreground'
                                  : daysRemaining <= 7
                                  ? 'bg-warning text-warning-foreground'
                                  : 'bg-success text-success-foreground'
                              }
                            >
                              {isOverdue
                                ? `${Math.abs(daysRemaining)} days overdue`
                                : `${daysRemaining} days remaining`}
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            {loan.canRenew ? (
                              <Button variant="outline" size="sm">
                                Renew
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                Cannot Renew
                              </Button>
                            )}
                            <Button
                              size="sm"
                              className="bg-success hover:bg-success/90"
                            >
                              Return Book
                            </Button>
                          </div>
                        </div>

                        {isOverdue && loan.fineAmount && loan.fineAmount > 0 && (
                          <Card className="p-3 bg-destructive/10 border-destructive/20">
                            <p className="text-sm font-semibold text-destructive">
                              Fine Amount: R$ {loan.fineAmount.toFixed(2)} (R$ 2.00/day)
                            </p>
                          </Card>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Reservations Tab */}
        <TabsContent value="reservations" className="mt-8">
          {mockReservations.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg">
              <ListOrdered className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-bold text-secondary mb-2">No Active Reservations</h3>
              <p className="text-muted-foreground">
                You don't have any books in the reservation queue.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockReservations.map((reservation) => (
                <Card key={reservation.id} className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div
                      className="w-32 h-48 flex-shrink-0 rounded overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/book/${reservation.book.id}`)}
                    >
                      <img
                        src={reservation.book.coverUrl}
                        alt={reservation.book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3
                          className="text-xl font-bold text-secondary cursor-pointer hover:text-primary"
                          onClick={() => navigate(`/book/${reservation.book.id}`)}
                        >
                          {reservation.book.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {reservation.book.author}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Queue Position
                          </p>
                          <Badge className="bg-warning text-warning-foreground">
                            #{reservation.position} in queue
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Estimated Availability
                          </p>
                          <p className="text-sm font-medium">
                            {new Date(reservation.estimatedAvailability).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Requested
                          </p>
                          <p className="text-sm font-medium">
                            {new Date(reservation.requestedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        Cancel Reservation
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-8">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Borrowed</TableHead>
                  <TableHead>Returned</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanHistory.map((loan) => (
                  <TableRow
                    key={loan.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/book/${loan.book.id}`)}
                  >
                    <TableCell className="font-medium">
                      {loan.book.title}
                    </TableCell>
                    <TableCell>{loan.book.author}</TableCell>
                    <TableCell>
                      {new Date(loan.borrowedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {loan.returnedDate
                        ? new Date(loan.returnedDate).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Returned
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist" className="mt-8">
          {wishlistBooks.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg">
              <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-bold text-secondary mb-2">
                No Books in Wishlist
              </h3>
              <p className="text-muted-foreground mb-4">
                Start adding books to your wishlist to keep track of what you
                want to read.
              </p>
              <Button onClick={() => navigate('/')}>Browse Books</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <h3 className="font-bold text-secondary line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {book.author}
                      </p>
                      <Button
                        className="w-full mt-2"
                        disabled={!isAvailable}
                      >
                        {isAvailable ? 'Borrow Now' : 'Not Available'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
