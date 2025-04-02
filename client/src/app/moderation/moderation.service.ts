import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Review } from '../models/review.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModerationService {
  private apiUrl = `${environment.apiUrl}/moderation`;

  constructor(private http: HttpClient) {}

  getPendingReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/pending`);
  }

  approveReview(reviewId: string): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/approve/${reviewId}`, {});
  }

  rejectReview(reviewId: string, reason: string): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/reject/${reviewId}`, {reason});
  }

  flagReview(reviewId: string, flagType: string): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/flag/${reviewId}`, {flagType});
  }

  updateModeratorNotes(reviewId: string, notes: string): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/notes/${reviewId}`, {notes});
  }
}