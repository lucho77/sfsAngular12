import { Injectable } from '@angular/core';
import { Router, CanLoad } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad {
    constructor(private router: Router) { }
   canLoad() {
    console.log('entro al metodo del Auth Guard');
    if (localStorage.getItem('currentUser')) {
        // logged in so return true
        console.log('Permitido en el AuthGuard');
        return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login']);
    console.log('No Permitido');
    return false;
   }
}
