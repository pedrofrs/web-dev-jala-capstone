import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, FileText, Hash, User, MapPin, Award, Building2, Download, BookOpen } from 'lucide-react';
import { mockBooks } from '../lib/data';
import { StatusBadge } from '../components/StatusBadge';
import { CitationDialog } from '../components/CitationDialog';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { Progress } from '../components/ui/progress';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [readingStatus, setReadingStatus] = useState<string>('reading');

  const book = mockBooks.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Book not found</h2>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const getDaysRemaining = () => {
    if (book.status === 'borrowed') {
      const returnDate = new Date('2026-03-20');
      const today = new Date('2026-03-07');
      const diffTime = returnDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return null;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Book Cover */}
          <div>
            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.05)] sticky top-8">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column - Book Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3 flex-wrap">
                <Badge variant="outline" className="text-sm">
                  {book.category}
                </Badge>
                <StatusBadge status={book.status} />
                {book.availabilityType === 'digital' && (
                  <Badge className="bg-secondary text-secondary-foreground gap-1">
                    <Download className="w-3 h-3" />
                    Digital Access
                  </Badge>
                )}
                {book.availabilityType === 'both' && (
                  <Badge className="bg-primary text-primary-foreground gap-1">
                    <BookOpen className="w-3 h-3" />
                    Physical + Digital
                  </Badge>
                )}
                {book.courseReserve && book.courseReserve.length > 0 && (
                  <Badge className="bg-warning text-warning-foreground">
                    Course Reserve
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-secondary">
                {book.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{book.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{book.publishedYear}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{book.pages} pages</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-bold text-secondary">Description</h3>
              <p className="text-foreground leading-relaxed">
                {book.description}
              </p>
            </div>

            <Separator />

            {/* Institutional Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Publisher
                </h4>
                <p className="text-foreground">{book.publisher}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Edition
                </h4>
                <p className="text-foreground">{book.edition}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Department
                </h4>
                <p className="text-foreground">{book.department}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  ISBN
                </h4>
                <code className="font-mono font-medium text-foreground">{book.isbn}</code>
              </div>
            </div>

            {book.doi && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  DOI
                </h4>
                <code className="font-mono font-medium text-foreground">{book.doi}</code>
              </div>
            )}

            <Separator />

            {/* Physical Location Map */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary">Physical Location</h3>
                    <p className="text-sm text-muted-foreground">Find this book in the library</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Shelf Code
                    </p>
                    <code className="font-mono text-lg font-bold text-primary">
                      {book.shelfLocation}
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Location
                    </p>
                    <p className="font-medium text-foreground">{book.floor}</p>
                    <p className="text-sm text-muted-foreground">{book.wing}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Building2 className="w-4 h-4 mr-2" />
                  View Library Map
                </Button>
              </div>
            </Card>

            {/* Academic Impact */}
            {book.academicImpact && (
              <Card className="p-4 bg-accent border-border">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-secondary">
                      Referenced in {book.academicImpact} Academic Works
                    </p>
                    <p className="text-xs text-muted-foreground">
                      High-impact resource for research
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Course Reserves */}
            {book.courseReserve && book.courseReserve.length > 0 && (
              <Card className="p-4 bg-warning/10 border-warning/20">
                <div className="space-y-2">
                  <p className="font-semibold text-secondary">
                    Required Reading For:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {book.courseReserve.map((course) => (
                      <Badge
                        key={course}
                        variant="outline"
                        className="border-warning text-warning-foreground"
                      >
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Citation Tool */}
            <div className="flex gap-3">
              <CitationDialog book={book} />
              {book.availabilityType === 'digital' || book.availabilityType === 'both' && (
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Access Digital
                </Button>
              )}
            </div>

            <Separator />

            {/* Reading Status Tracker */}
            <div className="space-y-4 p-6 bg-accent rounded-lg">
              <h3 className="font-bold text-secondary">Reading Status</h3>
              <ToggleGroup
                type="single"
                value={readingStatus}
                onValueChange={(value) => value && setReadingStatus(value)}
                className="justify-start"
              >
                <ToggleGroupItem value="reading" className="px-6">
                  Reading
                </ToggleGroupItem>
                <ToggleGroupItem value="completed" className="px-6">
                  Completed
                </ToggleGroupItem>
                <ToggleGroupItem value="wishlist" className="px-6">
                  Wishlist
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Loan Action Area */}
            <div className="space-y-4 p-6 bg-card border border-border rounded-lg">
              {book.status === 'available' && (
                <Button className="w-full h-12 bg-primary hover:bg-primary/90">
                  Borrow This Book
                </Button>
              )}

              {book.status === 'borrowed' && daysRemaining !== null && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Return in {daysRemaining} days</span>
                    <Badge className="bg-warning text-warning-foreground">
                      Due Soon
                    </Badge>
                  </div>
                  <Progress value={(13 / 28) * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Return date: March 20, 2026
                  </p>
                  <Button className="w-full" variant="outline">
                    Reserve This Book
                  </Button>
                </div>
              )}

              {book.status === 'reserved' && (
                <div className="space-y-3">
                  <Badge className="bg-warning text-warning-foreground w-full justify-center py-2">
                    Currently Reserved
                  </Badge>
                  <p className="text-sm text-muted-foreground text-center">
                    This book is reserved. You'll be notified when it becomes
                    available.
                  </p>
                  <Button className="w-full" disabled>
                    Reserve This Book
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
