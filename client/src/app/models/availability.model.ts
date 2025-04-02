export interface Availability {
  date: Date;
  available: boolean;
  availableSlots: number;
  bookedSlots: number;
  timeSlots?: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}