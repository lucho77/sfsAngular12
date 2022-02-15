import { Injectable } from '@angular/core';
import { timer, Observable, Subject, ObjectUnsubscribedError, Subscription } from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
export class ClockService {
  clock: Observable <number>;
  infofecha$ = new Subject<ValorReloj>();
  vr: ValorReloj;
  hours: number;
  minute: number;
  valorLogica: number;

  sub: Subscription;

  constructor() {
     this.clock = timer(0, 60000).pipe(map(t => this.valorLogica), shareReplay(1));

   }
   getInfoReloj(minutos: number): Observable<ValorReloj> {
    this.valorLogica = minutos;
    this.sub = this.clock.subscribe(t => {
        this.valorLogica = this.valorLogica - 1;
        if (this.valorLogica === -1) {
           this.valorLogica = 0;
        }
      this.minute = this.valorLogica % 60;
      this.hours = Math.trunc(this.valorLogica / 60);
       this.vr = {
         hora: this.hours,
         minutos: (this.minute < 10) ? '0' + this.minute : this.minute.toString(),
         // diaymes: t.toLocaleString('es-AR', { day: '2-digit', month: 'long' }).replace('.', '').replace('-', ' '),
         // diadesemana: t.toLocaleString('es-AR', { weekday: 'long' }).replace('.', ''),

       };
       this.infofecha$.next(this.vr);
     });
     return this.infofecha$.asObservable();

   }
   unsuscribe() {
    this.sub.unsubscribe();
  }

}
export class ValorReloj {
    hora: number;
    minutos: string;
  }
