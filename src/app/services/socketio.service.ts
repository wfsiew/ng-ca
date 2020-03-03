import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private socket;
  private baseUrl = environment.baseSocketUrl;

  constructor() { }

  setupSocketConnection() {
    this.socket = io(this.baseUrl);
  }

  on(event: string) {
    return new Observable((observer) => {
      this.socket.on(event, data => {
        observer.next(data);
      });
    });
  }

  send(event: string, data: any) {
    this.socket.emit(event, data);
  }
}
