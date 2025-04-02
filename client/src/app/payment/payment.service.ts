import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentRequest, PaymentResponse } from '../models/payment.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  processPayment(payment: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(this.apiUrl, payment);
  }

  getPaymentStatus(paymentId: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/${paymentId}/status`);
  }

  savePaymentMethod(paymentMethod: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/methods`, paymentMethod);
  }
}