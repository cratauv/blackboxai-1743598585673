import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private apiUrl = `${environment.apiUrl}/filters`;

  constructor(private http: HttpClient) {}

  getPropertyTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/property-types`);
  }

  getAmenities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/amenities`);
  }

  getAccessibilityOptions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/accessibility`);
  }

  getCancellationPolicies(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cancellation-policies`);
  }
}