import React from 'react';
import { Badge } from './ui/badge';

interface StatusBadgeProps {
  status: 'available' | 'borrowed' | 'reserved';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    available: {
      label: 'Available',
      className: 'bg-[#22C55E] text-white hover:bg-[#22C55E]/90',
    },
    borrowed: {
      label: 'Borrowed',
      className: 'bg-[#64748B] text-white hover:bg-[#64748B]/90',
    },
    reserved: {
      label: 'Reserved',
      className: 'bg-[#F59E0B] text-white hover:bg-[#F59E0B]/90',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}
