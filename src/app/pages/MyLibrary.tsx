import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  User,
  Mail,
  GraduationCap,
  ListOrdered,
  BookMarked,
  Trash2,
} from 'lucide-react';
import { mockStudent } from '../lib/data';
import { Book } from '../lib/data';
import { FinesWidget } from '../components/FinesWidget';
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
import {
  getLibrary,
  removeFromLibrary,
  getWishlist,
  removeFromWishlist,
} from '../services/localStorageService';
import {
  ActiveLoan,
  LoanHistoryEntry,
  getLoans,
  getLoanHistory,
  returnBook,
  renewLoan,
  calculateLoanFine,
  calculateTotalFines,
  getDaysRemaining,
  isOverdue,
  BORROW_FEE,
  OVERDUE_RATE_PER_DAY,
} from '../services/loanService';

export default function MyLibrary() {
  const navigate = useNavigate();
  const location = useLocation();

  // Allow BookDetails to deep-link directly to the loans tab
  const initialTab = (location.state as { tab?: string } | null)?.tab ?? 'loans';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [loans, setLoans] = useState<ActiveLoan[]>([]);
  const [loanHistory, setLoanHistory] = useState<LoanHistoryEntry[]>([]);
  const [totalFines, setTotalFines] = useState(0);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [savedWishlist, setSavedWishlist] = useState<Book[]>([]);

  function refreshLoans() {
    const active = getLoans();
    setLoans(active);
    setLoanHistory(getLoanHistory());
    setTotalFines(calculateTotalFines());
  }

  useEffect(() => {
    refreshLoans();
    setMyBooks(getLibrary());
    setSavedWishlist(getWishlist());
  }, [activeTab]);

  function handleReturn(loanId: string) {
    returnBook(loanId);
    refreshLoans();
  }

  function handleRenew(loanId: string) {
    renewLoan(loanId);
    refreshLoans();
  }

  function handleRemoveFromLibrary(bookId: string) {
    removeFromLibrary(bookId);
    setMyBooks((prev) => prev.filter((b) => b.id !== bookId));
  }

  function handleRemoveFromWishlist(bookId: string) {
    removeFromWishlist(bookId);
    setSavedWishlist((prev) => prev.filter((b) => b.id !== bookId));
  }

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Student Identity Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
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
      </Card>

      {/* Fines Widget — driven by real loan data */}
      <FinesWidget student={{ ...mockStudent, totalFines }} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="loans">
            <BookOpen className="w-4 h-4 mr-2" />
            Current Loans
            {loans.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0">
                {loans.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="my-books">
            <BookMarked className="w-4 h-4 mr-2" />
            Minha Biblioteca
            {myBooks.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0">
                {myBooks.length}
              </Badge>
            )}
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
            {savedWishlist.length > 0 && (
              <Badge className="ml-2 bg-rose-500 text-white text-xs px-1.5 py-0">
                {savedWishlist.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Current Loans ── */}
        <TabsContent value="loans" className="space-y-6 mt-8">
          {loans.length === 0 ? (
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
              {loans.map((loan) => {
                const daysLeft = getDaysRemaining(loan);
                const overdue = isOverdue(loan);
                const fine = calculateLoanFine(loan);
                const overdueCharge = fine - BORROW_FEE;

                return (
                  <Card key={loan.id} className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Cover */}
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
                          <p className="text-muted-foreground">{loan.book.author}</p>
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                            <span>Shelf:</span>
                            <code className="font-mono font-medium">
                              {loan.book.shelfLocation}
                            </code>
                          </div>
                        </div>

                        {/* Dates + badge */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>
                                Borrowed:{' '}
                                {new Date(loan.borrowedDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>
                                Due:{' '}
                                {new Date(loan.returnDate).toLocaleDateString()}
                              </span>
                            </div>
                            <Badge
                              className={
                                overdue
                                  ? 'bg-destructive text-destructive-foreground'
                                  : daysLeft <= 7
                                  ? 'bg-warning text-warning-foreground'
                                  : 'bg-success text-success-foreground'
                              }
                            >
                              {overdue
                                ? `${Math.abs(daysLeft)} days overdue`
                                : `${daysLeft} days remaining`}
                            </Badge>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRenew(loan.id)}
                            >
                              Renew (+1 mês)
                            </Button>
                            <Button
                              size="sm"
                              className="bg-success hover:bg-success/90"
                              onClick={() => handleReturn(loan.id)}
                            >
                              Return Book
                            </Button>
                          </div>
                        </div>

                        {/* Fine breakdown */}
                        <Card className={`p-3 ${overdue ? 'bg-destructive/10 border-destructive/20' : 'bg-muted/50 border-border'}`}>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span>
                              Taxa de empréstimo:{' '}
                              <strong>R$ {BORROW_FEE.toFixed(2)}</strong>
                            </span>
                            {overdue && (
                              <span className="text-destructive">
                                Atraso ({Math.abs(daysLeft)} dias × R${' '}
                                {OVERDUE_RATE_PER_DAY.toFixed(2)}/dia):{' '}
                                <strong>R$ {overdueCharge.toFixed(2)}</strong>
                              </span>
                            )}
                            <span className={overdue ? 'text-destructive font-bold' : ''}>
                              Total: <strong>R$ {fine.toFixed(2)}</strong>
                            </span>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ── My Books (localStorage) ── */}
        <TabsContent value="my-books" className="mt-8">
          {myBooks.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg">
              <BookMarked className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-bold text-secondary mb-2">Nenhum livro salvo</h3>
              <p className="text-muted-foreground mb-4">
                Adicione livros à sua biblioteca pelo catálogo ou pelos detalhes de cada livro.
              </p>
              <Button onClick={() => navigate('/')}>Explorar Catálogo</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div
                    className="aspect-[2/3] relative overflow-hidden bg-muted cursor-pointer"
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
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
                      onClick={() => handleRemoveFromLibrary(book.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remover da Biblioteca
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Reservations ── */}
        <TabsContent value="reservations" className="mt-8">
          <div className="text-center py-16 bg-card rounded-lg">
            <ListOrdered className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-bold text-secondary mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">
              Reservation management will be available in a future update.
            </p>
          </div>
        </TabsContent>

        {/* ── History ── */}
        <TabsContent value="history" className="mt-8">
          {loanHistory.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-bold text-secondary mb-2">Nenhum histórico</h3>
              <p className="text-muted-foreground">
                Os livros devolvidos aparecerão aqui.
              </p>
            </div>
          ) : (
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
                  {loanHistory.map((entry) => (
                    <TableRow
                      key={entry.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/book/${entry.book.id}`)}
                    >
                      <TableCell className="font-medium">{entry.book.title}</TableCell>
                      <TableCell>{entry.book.author}</TableCell>
                      <TableCell>
                        {new Date(entry.borrowedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(entry.returnedDate).toLocaleDateString()}
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
          )}
        </TabsContent>

        {/* ── Wishlist (localStorage) ── */}
        <TabsContent value="wishlist" className="mt-8">
          {savedWishlist.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg">
              <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-bold text-secondary mb-2">Nenhum livro na Wishlist</h3>
              <p className="text-muted-foreground mb-4">
                Adicione livros à sua wishlist pelo catálogo ou pelos detalhes de cada livro.
              </p>
              <Button onClick={() => navigate('/')}>Explorar Catálogo</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedWishlist.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                      onClick={() => handleRemoveFromWishlist(book.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remover da Wishlist
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
