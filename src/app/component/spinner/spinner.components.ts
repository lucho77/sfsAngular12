import { DOCUMENT } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";
@Component({
    selector: 'app-spinner',
    templateUrl:'./spinner.components.html' ,
  })export class SpinnerComponent implements   OnDestroy {
   // @Output()emitSpinner = new EventEmitter<any>();
  
    public isSpinnerVisible = true;
  
  
    constructor(private router: Router) {
        this.isSpinnerVisible = true;
        this.router.events.subscribe(
            event => {
                if (event instanceof NavigationStart) {
                    this.isSpinnerVisible = true;
                  }
                  if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
                    this.isSpinnerVisible = false;
                  }
         //     this.emitSpinner.emit(this.isSpinnerVisible);
    
            },      
            () => {
             // this.isSpinnerVisible = false;
            }
          );

    }
  
    ngOnDestroy(): void {
      this.isSpinnerVisible = false;
    }
}