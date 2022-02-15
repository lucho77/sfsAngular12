import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ChatPojoDTO } from '../_models/chatPojoDTO';
@Injectable({ providedIn: 'root' })
export class NotificationChatService {
    constructor() { }
    private countChangedSource = new Subject<void>();
    public notiChanged$ = this.countChangedSource.asObservable();
    private count: number;
    private notificaPojos: ChatPojoDTO[];
    setearCountNotifica(count: number, notificaPojos: ChatPojoDTO[]) {
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
