import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AbmParams } from '../_models/abmParams';
@Injectable({ providedIn: 'root' })
export class ParamDataHijoService {
    constructor() { }
    private paramChangedSource = new Subject<void>();
    public paramChanged$ = this.paramChangedSource.asObservable();
    private abmParams: AbmParams;
    setearParam(param: AbmParams) {
      this.abmParams = param;
      this.paramChangedSource.next();
      }
      getParam() {
        return this.abmParams;
    }
}
