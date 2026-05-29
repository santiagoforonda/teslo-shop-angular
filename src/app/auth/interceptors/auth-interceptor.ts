import { HttpEvent,  HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req:HttpRequest<unknown>,next:HttpHandlerFn):Observable<HttpEvent<unknown>>=> {

  const authToken = inject(AuthService).token();

  const newReq = req.clone({
    headers:req.headers.append("Authorization", `Bearer ${authToken}`)
  });

  return  next(newReq);
};
