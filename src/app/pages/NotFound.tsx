import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { BookX } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <BookX className="w-24 h-24 mx-auto text-muted-foreground" />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-secondary">404</h1>
          <h2 className="text-2xl font-bold text-secondary">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
        </div>
        <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
