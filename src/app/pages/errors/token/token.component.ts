import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TokenComponent implements AfterViewInit {

  router: Router;

  constructor(router: Router) {
      this.router = router;
  }

  ngAfterViewInit() {
      document.getElementById('preloader').classList.add('hide');
  }

}
