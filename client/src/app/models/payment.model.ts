export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  bookingId?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  id: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'partially_refunded';
  amount: number;
  amountRefunded: number;
  currency: string;
  paymentMethod: string;
  receiptUrl?: string;
  refundUrl?: string;
  createdAt: Date;
  bookingId?: string;
  description?: string;
  customerEmail?: string;
  refundable: boolean;
}

export interface RefundRequest {
  paymentId: string;
  amount: number;
  reason: string;
  bookingId: string;
}
