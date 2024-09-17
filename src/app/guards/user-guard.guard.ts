import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProvider } from '../provider/user';

@Injectable({
  providedIn: 'root'
})
export class UserGuardGuard implements CanActivate {
  private userProvider = inject(UserProvider);
  private router = inject(Router);


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.userProvider.user){
      return true;
    }

    this.router.navigate(['/']);
    return false;

  }
  
}
