import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface BookingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  imageUrl: string;
  rating: number;
}

interface Review {
  _id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  language: string;
  status: string;
  createdAt: Date;
}

interface ReviewsResponse {
  data: Review[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class BookingOptionsService {
  private http = inject(HttpClient);

  searchOptions(query: string, filters: any = {}): Observable<BookingOption[]> {
    return this.http.get<BookingOption[]>('/api/booking-options/search', {
      params: { q: query, ...filters }
    });
  }

  getFeaturedOptions(): Observable<BookingOption[]> {
    return this.http.get<BookingOption[]>('/api/booking-options/featured');
  }

  getOptionDetails(id: string): Observable<BookingOption> {
    return this.http.get<BookingOption>(`/api/booking-options/${id}`);
  }

  getReviews(params: any): Observable<ReviewsResponse> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });

    return this.http.get<ReviewsResponse>('/api/reviews', { params: httpParams });
  }
}
