export interface SearchCriteria {
  query?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  types?: string[];
  amenities?: string[];
  rating?: number;
  filters?: {
    propertyTypes?: string[];
    amenities?: string[];
    accessibility?: string[];
    cancellation?: string[];
  };
}

export interface SearchResult {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  available: boolean;
}