import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-global-params',
  templateUrl: './globalParamsError.component.html',
  styleUrls: ['./globalParamsError.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GlobalParamsErrorComponent implements AfterViewInit {

  router: Router;

  constructor(router: Router) {
      this.router = router;
  }

  ngAfterViewInit() {
      document.getElementById('preloader').classList.add('hide');
  }

}
