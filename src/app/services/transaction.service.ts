import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getCredit() {
    return this.http.get(`${this.baseUrl}/api/transaction/credit`);
  }

  getTransactions() {
    let prm: HttpParams = new HttpParams()
      .set('start', '0')
      .set('length', '50')
      .set('order', 'create_time')
      .set('dir', 'desc');
    return this.http.get(`${this.baseUrl}/api/transaction/list`, { params: prm });
  }

  getPaymentDetails(num) {
    let prm: HttpParams = new HttpParams()
      .set('num', `${num}`);
    return this.http.get(`${this.baseUrl}/api/retail-inbound`, { params: prm });
  }

  confirmPayment(o) {
    return this.http.post(`${this.baseUrl}/api/transaction/confirm-payment`, o);
  }
}
