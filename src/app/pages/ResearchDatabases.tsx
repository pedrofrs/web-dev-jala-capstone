import React from 'react';
import { Database } from 'lucide-react';
import { Card } from '../components/ui/card';

export default function ResearchDatabases() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-secondary">Research Databases</h1>
        <p className="text-muted-foreground">
          Access academic journals, theses, and digital resources
        </p>
      </div>

      <div className="text-center py-16 bg-card rounded-lg">
        <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-bold text-secondary mb-2">Research Databases</h3>
        <p className="text-muted-foreground">
          Digital research database access coming soon.
        </p>
      </div>
    </div>
  );
}
