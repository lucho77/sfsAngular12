import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-externalerror',
  templateUrl: './externalLoginError.component.html',
  styleUrls: ['./externalLoginError.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExternalLoginErrorComponent implements AfterViewInit {

  router: Router;

  constructor(router: Router) {
      this.router = router;
  }


  ngAfterViewInit() {
      document.getElementById('preloader').classList.add('hide');
  }

}
