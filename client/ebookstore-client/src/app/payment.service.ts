import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:5001/api/payment';

  constructor(private http: HttpClient) { }

  createOrder(totalAmount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`, { totalAmount });
  }
}
