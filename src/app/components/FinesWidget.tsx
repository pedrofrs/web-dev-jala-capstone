import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, CreditCard } from 'lucide-react';
import { Student } from '../lib/data';

interface FinesWidgetProps {
  student: Student;
}

export function FinesWidget({ student }: FinesWidgetProps) {
  const hasFines = student.totalFines > 0;

  if (!hasFines) {
    return (
      <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-secondary">No Outstanding Fines</h3>
            <p className="text-sm text-muted-foreground">
              Your account is in good standing
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-secondary">Outstanding Fines</h3>
            <p className="text-sm text-muted-foreground">
              Overdue returns incur R$ 2.00 per day
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-destructive">
            R$ {student.totalFines.toFixed(2)}
          </span>
        </div>

        <Button className="w-full bg-destructive hover:bg-destructive/90">
          <CreditCard className="w-4 h-4 mr-2" />
          Pay Now
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Payment required before borrowing new books
        </p>
      </div>
    </Card>
  );
}
