export interface Booking {
  property: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  specialRequests: string;
  paymentMethod: string;
  optionId: string;
  date: string;
  time: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  paymentInfo: {
    method: string;
    details: string;
  };
}
