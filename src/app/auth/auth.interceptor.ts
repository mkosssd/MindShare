import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpParams
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { take,exhaustMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler){
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user=>{
        if(!user){
        return next.handle(request)
      }
      const modifiedReq = request.clone({
        params:new HttpParams().set('auth',user.token)
      })
      return next.handle(modifiedReq)
     } ))
  }
}
