import { useState, useMemo, useEffect } from 'react';
import { Search, BookMarked, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { BookCard, BookCardSkeleton } from '../components/BookCard';
import { Book } from '../lib/data';
import { searchBooks } from '../services/googleBooksApi';
import { adaptGoogleBooksVolumesToBooks } from '../services/bookAdapter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const CATEGORIES = ['all', 'Fiction', 'Science', 'History', 'Philosophy'];
const DEPARTMENTS = [
  'General',
  'Computer Science',
  'History',
  'Literature',
  'Science',
  'Philosophy',
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('title');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [activeTab, setActiveTab] = useState('catalog');

  // Fetch books when search query changes or on initial load
  useEffect(() => {
    const fetchBooks = async () => {
      const queryToUse = searchQuery.trim() || 'programming';

      setIsLoading(true);
      setStartIndex(0);
      try {
        const response = await searchBooks(queryToUse, 0);
        if (response.items) {
          setBooks(adaptGoogleBooksVolumesToBooks(response.items));
          setTotalItems(response.totalItems);
          setStartIndex(response.items.length);
        } else {
          setBooks([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setBooks([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery]);

  async function handleLoadMore() {
    const queryToUse = searchQuery.trim() || 'programming';
    setIsLoadingMore(true);
    try {
      const response = await searchBooks(queryToUse, startIndex);
      if (response.items) {
        setBooks((prev) => [...prev, ...adaptGoogleBooksVolumesToBooks(response.items!)]);
        setStartIndex((prev) => prev + response.items!.length);
      }
    } catch (error) {
      console.error('Failed to load more books:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }

  const hasMore = books.length < totalItems;

  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books;

    // Filter by search query (title, author, ISBN, DOI)
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (book.doi && book.doi.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    // Filter by department
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter((book) => book.department === selectedDepartment);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'year':
          return b.publishedYear - a.publishedYear;
        default:
          return 0;
      }
    });

    return sorted;
  }, [books, selectedCategory, selectedDepartment, sortBy]);

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-secondary">Academic Discovery</h1>
        <p className="text-muted-foreground">
          Explore our comprehensive collection of institutional academic resources
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by title, author, ISBN, or DOI..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 border-2 focus:border-primary transition-colors bg-input-background"
        />
      </div>

      {/* Tabs for Catalog and Course Reserves */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="catalog">Full Catalog</TabsTrigger>
          <TabsTrigger value="course-reserves">
            <BookMarked className="w-4 h-4 mr-2" />
            Course Reserves
          </TabsTrigger>
        </TabsList>

        {/* Full Catalog Tab */}
        <TabsContent value="catalog" className="space-y-6 mt-6">
          {/* Filters and Sort */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? 'bg-primary hover:bg-primary/90'
                      : ''
                  }
                >
                  {category === 'all' ? 'All Books' : category}
                </Button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="author">Author (A-Z)</SelectItem>
                  <SelectItem value="year">Year (Newest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Book Grid */}
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {filteredAndSortedBooks.length} books found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <BookCardSkeleton key={i} />
                  ))
                : filteredAndSortedBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
            </div>

            {!isLoading && hasMore && filteredAndSortedBooks.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  className="px-8 gap-2"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoadingMore ? 'Carregando...' : 'Carregar mais livros'}
                </Button>
              </div>
            )}

            {!isLoading && filteredAndSortedBooks.length === 0 && (
              <Card className="text-center py-16">
                <div className="max-w-md mx-auto space-y-4">
                  <Search className="w-12 h-12 mx-auto text-muted-foreground" />
                  <h3 className="font-bold text-secondary">No books found</h3>
                  <p className="text-muted-foreground">
                    No books match your search criteria. Try searching for digital
                    alternatives in our Research Databases.
                  </p>
                  <Button variant="outline">Browse Databases</Button>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Course Reserves Tab */}
        <TabsContent value="course-reserves" className="space-y-6 mt-6">
          <div className="text-center py-16 bg-card rounded-lg">
            <BookMarked className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-bold text-secondary mb-2">
              Coming Soon
            </h3>
            <p className="text-muted-foreground">
              Course reserves will be available in a future update. 
              Use the search feature to find required reading materials.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
