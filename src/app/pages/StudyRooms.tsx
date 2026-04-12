import React from 'react';
import { DoorOpen } from 'lucide-react';
import { Card } from '../components/ui/card';

export default function StudyRooms() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-secondary">Study Room Booking</h1>
        <p className="text-muted-foreground">
          Reserve private and group study spaces
        </p>
      </div>

      <div className="text-center py-16 bg-card rounded-lg">
        <DoorOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-bold text-secondary mb-2">Study Room Booking</h3>
        <p className="text-muted-foreground">
          Study room booking functionality coming soon.
        </p>
      </div>
    </div>
  );
}
