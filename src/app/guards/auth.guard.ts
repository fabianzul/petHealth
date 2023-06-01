import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {Observable} from 'rxjs';
import { map, take, tap, switchMap } from 'rxjs/operators'
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/do';
//import 'rxjs/add/operator/take';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService,private router: Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //return true;
    if(this.auth.authenticated){return true;}

    return this.auth.currentUserObservable.pipe(
      take(1),
      map(user => {
          console.log('user: ', user);
          return !!user
      }),
      tap( loggedIn => {
          console.log("loggedIn: ", loggedIn);
          if (!loggedIn) {
              console.log("access denied");
              this.router.navigate(['/login']);
          }
      })
  );

  }
}
