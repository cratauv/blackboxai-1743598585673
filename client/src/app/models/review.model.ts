export interface Review {
  id: string;
  bookingOptionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
  status: 'approved'|'pending'|'rejected';
  flags?: {
    inappropriate: boolean;
    spam: boolean;
    fake: boolean;
  };
  moderatorNotes?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}