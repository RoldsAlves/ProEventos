import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, take, throwError } from 'rxjs';
import { User } from '@app/models/Identity/User';
import { AccountService } from '@app/services/account.service';
import { error } from 'console';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User;

    // this.accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);

    // if(currentUser){
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${currentUser.token}`
    //     }
    //   });
    // }
    this.accountService.currentUser$.pipe(take(1)).subscribe((user: User) => {
      currentUser = user;     
      if(currentUser){
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
      }
    });

    return next.handle(request).pipe(catchError(error => {
      if (error){
        localStorage.removeItem('user');
      }
      return throwError(error);
    }));
  }
}
