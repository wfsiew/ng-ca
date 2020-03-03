
import { empty as observableEmpty, throwError as observableThrowError, Observable, BehaviorSubject, TimeoutError } from 'rxjs';

import { take, filter, catchError, finalize, timeout, tap } from 'rxjs/operators';
import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private authService: AuthService,
    private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.getToken() === null) {
      return next.handle(request)
        .pipe(timeout(AppConstant.NETWORK_TIMEOUT))
        .pipe(tap(() => {},
          (error: any) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 401 || error.status === 403) {
                this.authService.clear();
                this.router.navigate(['/login']);
              }
            }
          }));
    }
    
    request = this.applyCredentials(request, this.authService.getToken());
    return next.handle(request)
      .pipe(timeout(AppConstant.NETWORK_TIMEOUT))
      .pipe(tap(() => { },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401 || error.status === 403) {
              this.handle401Error(request, next);
            }
          }
        }));

    // return next.handle(request)
    //   .pipe(timeout(AppConstant.NETWORK_TIMEOUT))
    //   .pipe(catchError((error: HttpErrorResponse) => {
    //     switch (error.status) {
    //       case 401:
    //       case 403:
    //         return this.handle401Error(request, next);

    //       default:
    //         return observableThrowError(error);
    //     }
    //   })
    // );
  }

  applyCredentials(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Token ${token}`
      }
    });
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    this.logoutUser(req, next);
  }

  logoutUser(req: HttpRequest<any>, next: HttpHandler) {
    this.authService.clear();
    this.router.navigate(['/login']);
  }

  _handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this._logoutUser(req, next);
  }

  _logoutUser(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.clear();
    this.router.navigate(['/login']);
    return observableEmpty();
  }

  mapErrorMessges(error) {
    console.log(error);
  }
}