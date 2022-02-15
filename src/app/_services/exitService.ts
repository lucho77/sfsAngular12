import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ExitService {
    constructor() { }
    private exitChangedSource = new Subject<void>();
    public exitChanged$ = this.exitChangedSource.asObservable();
    setearExitGlobal() {
      this.exitChangedSource.next();
    }
}
