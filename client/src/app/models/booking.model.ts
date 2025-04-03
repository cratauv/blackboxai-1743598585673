export interface Booking {
  id: string;
  user: string; // User ID
  property: string; // Property ID
  checkInDate: Date;
  checkOutDate: Date;
  guests: {
    adults: number;
    children?: number;
    infants?: number;
  };
  pricing: {
    nightlyRate: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    total: number;
  };
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod?: string;
  transactionId?: string;
  specialRequests?: string;
  cancellationPolicy?: 'flexible' | 'moderate' | 'strict';
  cancellationReason?: string;
  cancellationDate?: Date;
  refundAmount?: number;
  review?: {
    rating: number;
    comment?: string;
    date?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}