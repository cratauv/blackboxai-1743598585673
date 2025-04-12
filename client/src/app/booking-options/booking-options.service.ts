import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}