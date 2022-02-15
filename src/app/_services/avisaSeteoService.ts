import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AvisaSeteoService {
    constructor() { }

    private sujeto = new Subject<void>();
    public sujetoComoObservable$ = this.sujeto.asObservable();
    private visivilidad: boolean;
    private cantidadBotones: number;

    setVisivilidad(visivilidad: boolean) {
      if (visivilidad) {
        this.visivilidad = visivilidad;
      }     
        this.sujeto.next();
    }
    setCantidadBotones(cantidadBotones: number){
      if(cantidadBotones)
      {
        this.cantidadBotones = cantidadBotones;
      }
      this.sujeto.next();
    }

    getVisivilidad() {
      return this.visivilidad;
    }

    getCantidadBotones(){
      return this.cantidadBotones;
    }
}
