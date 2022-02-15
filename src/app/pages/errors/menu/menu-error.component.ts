import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu-error',
  templateUrl: './menu-error.component.html',
  styleUrls: ['./menu-error.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuErrorComponent implements AfterViewInit {

  router: Router;

  constructor(router: Router) {
      this.router = router;
  }


  ngAfterViewInit() {
      document.getElementById('preloader').classList.add('hide');
    }
}
