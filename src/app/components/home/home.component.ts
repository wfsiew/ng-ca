import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { SocketioService } from 'src/app/services/socketio.service';
import _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dropoff_no = '';
  list = [];
  confirm_payment_response = '';
  showConfirmPayment = false;

  data: any = {
    credit: 0
  }

  sdata = {}

  constructor(
    private router: Router,
    private authService: AuthService,
    private trxService: TransactionService,
    private socketService: SocketioService
  ) { }

  ngOnInit() {
    this.socketService.setupSocketConnection();
    this.socketService.on('ca-confirm-payment').subscribe((data: any) => {
      this.checkCreditForPayment(data);
    });
    this.load();
  }

  load() {
    this.trxService.getCredit().subscribe((res: any) => {
      this.data = res.status ? res.data : { credit: 0 };
    });
    this.trxService.getTransactions().subscribe((res: any) => {
      this.list = res.status ? res.data : [];
    });
  }

  checkCreditForPayment(data) {
    this.sdata = data;
    this.trxService.confirmPayment(data.barcode).subscribe((res: any) => {
      this.confirm_payment_response = res.message;
      this.showConfirmPayment = true;
    },
    (error) => {
      this.showConfirmPayment = false;
      if (error.error) {
        if (error.status === 400) {
          this.confirm_payment_response = error.error.message;
        }
      }

      this.socketService.send('ca-confirm-payment-fail', data);
    });
  }

  onSubmit() {
    if (_.isNull(this.dropoff_no) || this.dropoff_no === '') {
      return;
    }

    this.socketService.send('ca-scan-barcode', { barcode: this.dropoff_no });
  }

  onConfirmPay() {
    this.socketService.send('ca-confirm-payment-success', this.sdata);
  }

  logout() {
    this.authService.logout().subscribe(res => {
      this.authService.clear();
      this.router.navigate(['/login']);
    });
    
    return false;
  }
}
