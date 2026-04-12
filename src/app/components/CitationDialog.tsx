import React, { useState } from 'react';
import { Book } from '../lib/data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Copy, Check, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface CitationDialogProps {
  book: Book;
}

export function CitationDialog({ book }: CitationDialogProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const generateAPA = () => {
    return `${book.author.split(' ').pop()}, ${book.author.split(' ')[0].charAt(0)}. (${book.publishedYear}). ${book.title}. ${book.publisher}.`;
  };

  const generateABNT = () => {
    const authorUpper = book.author.split(' ').pop()?.toUpperCase();
    const firstName = book.author.split(' ').slice(0, -1).join(' ');
    return `${authorUpper}, ${firstName}. ${book.title}. ${book.edition}. ${book.publisher}, ${book.publishedYear}. ${book.pages} p.`;
  };

  const generateMLA = () => {
    return `${book.author}. ${book.title}. ${book.edition}. ${book.publisher}, ${book.publishedYear}.`;
  };

  const handleCopy = (format: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    toast.success(`Citation copied in ${format} format`);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Cite This Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Citation Generator</DialogTitle>
          <DialogDescription>
            Copy the citation in your preferred format
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="apa" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="apa">APA</TabsTrigger>
            <TabsTrigger value="abnt">ABNT</TabsTrigger>
            <TabsTrigger value="mla">MLA</TabsTrigger>
          </TabsList>

          <TabsContent value="apa" className="space-y-4">
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm font-mono leading-relaxed">
                {generateAPA()}
              </p>
            </div>
            <Button
              onClick={() => handleCopy('APA', generateAPA())}
              className="w-full"
            >
              {copiedFormat === 'APA' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy APA Citation
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="abnt" className="space-y-4">
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm font-mono leading-relaxed">
                {generateABNT()}
              </p>
            </div>
            <Button
              onClick={() => handleCopy('ABNT', generateABNT())}
              className="w-full"
            >
              {copiedFormat === 'ABNT' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy ABNT Citation
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="mla" className="space-y-4">
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm font-mono leading-relaxed">
                {generateMLA()}
              </p>
            </div>
            <Button
              onClick={() => handleCopy('MLA', generateMLA())}
              className="w-full"
            >
              {copiedFormat === 'MLA' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy MLA Citation
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
