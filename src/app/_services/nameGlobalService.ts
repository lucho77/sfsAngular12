import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class NameGlobalService {
    constructor() { }
    private nameChangedSource = new Subject<void>();
    public nameChanged$ = this.nameChangedSource.asObservable();
    private name: string;
    private detalle: string;
    setearNameGlobal(name: string, detalle: string) {
      if (name) {
        this.name = name;
      }
      if (detalle) {
        this.detalle = detalle;
      }
      this.nameChangedSource.next();
      }
      getName() {
        return this.name;
    }
    getDetalle() {
      return this.detalle;
  }
}
