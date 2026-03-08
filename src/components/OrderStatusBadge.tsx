import React from 'react';

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/20 text-warning-foreground' },
  confirmed: { label: 'Confirmed', className: 'bg-info/20 text-info' },
  preparing: { label: 'Preparing', className: 'bg-secondary/30 text-secondary-foreground' },
  ready: { label: 'Ready for Pickup', className: 'bg-success/20 text-success' },
  completed: { label: 'Completed', className: 'bg-success/20 text-success' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/20 text-destructive' },
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] || { label: status, className: 'bg-muted text-muted-foreground' };
  return <span className={`badge-status ${config.className}`}>{config.label}</span>;
};

export default OrderStatusBadge;
