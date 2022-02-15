import { Subject } from 'rxjs';
import { NotificaPojoDTO } from '../_models/notificaPojoDTO';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class NotificationService {
    constructor() { }
    private countChangedSource = new Subject<void>();
    public notiChanged$ = this.countChangedSource.asObservable();
    private count: number;
    private notificaPojos: NotificaPojoDTO[];
    setearCountNotifica(count: number, notificaPojos: NotificaPojoDTO[]) {
        this.count = count;
        this.notificaPojos = notificaPojos;
        this.countChangedSource.next();
      }
      getCount() {
        return this.count;
    }
    getNotificas() {
      return this.notificaPojos;
    }
}
