import { Injectable } from '@angular/core';

import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class RedirectGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

      window.open(route.params.data + '?datasource=' + route.params.datasource + '&username=' + route.params.username
      + '&mapa=' + route.params.mapa , '_self');
      return true;

  }
}
