import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from './environment';
@Injectable()
export class AuthorizeInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${environment.authToken}`,
      },
    });
    return next.handle(request).pipe(
      tap(
        (data: any) => {
          if (data instanceof HttpResponse) {
            return data;
          }
          return null;
        },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              // this.dialog.open(DialogContentComponent, {
              //   data: { name: 'session time out. Please login again' },
              // });
            }
          }
          return throwError(error);
        }
      )
    );
  }
}
