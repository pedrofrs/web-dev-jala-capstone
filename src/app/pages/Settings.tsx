import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Card } from '../components/ui/card';

export default function Settings() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-secondary">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and notifications
        </p>
      </div>

      <div className="text-center py-16 bg-card rounded-lg">
        <SettingsIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-bold text-secondary mb-2">Settings Page</h3>
        <p className="text-muted-foreground">
          Settings functionality coming soon.
        </p>
      </div>
    </div>
  );
}
