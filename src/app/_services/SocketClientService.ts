/*
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, switchMap, map } from 'rxjs/operators';
import { Client, over } from 'stompjs';
import { User } from '../_models';
import { SocketClientState } from './SocketClientState';
import * as SockJS from 'sockjs-client';
import { devolverProyecto } from '../pages/home/reportdef/reportdefUtil';
import { ChatUtilDTO } from '../_models/chatUtilDTO';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
  })
  export class SocketClientService {
    private client: Client;
    private state: BehaviorSubject<SocketClientState>;
    constructor(public http: HttpClient) {
      this.client = over(new SockJS('http://localhost:8081/sfsSockets'));
      this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
      const user = <User>JSON.parse(localStorage.getItem('currentUser'));
      const u = JSON.stringify(user);

      this.client.connect({'login': u}, () => {
        this.state.next(SocketClientState.CONNECTED);
      });
    }

    private connect(): Observable<Client> {
      return new Observable<Client>(observer => {
        this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
          observer.next(this.client);
        });
      });
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
        this.connect().pipe(first()).subscribe(client => client.disconnect(null));
      }
      onMessage(topic: string, handler = SocketClientService.jsonHandler): Observable<any> {
        return this.connect().pipe(first(), switchMap(inst => {
          return new Observable<any>(observer => {
            const subscription = inst.subscribe(topic, message => {
              observer.next(handler(message));
            });
            return () => inst.unsubscribe(subscription.id);
          });
        }));
      }

      onPlainMessage(topic: string): Observable<string> {
        return this.onMessage(topic, SocketClientService.textHandler);
      }

      send(topic: string, payload: any): void {
        this.connect()
          .pipe(first())
          .subscribe(inst => inst.send(topic, {}, JSON.stringify(payload)));
      }
      chatGeneric(user: User, datos: ChatUtilDTO) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.packageModel = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post(`${devolverProyecto()}/chatUtil/`, datos)
        .pipe(map(result => result));
    }
      // tslint:disable-next-line:member-ordering
      static jsonHandler(message: any): any {
        return JSON.parse(message.body);
      }

      // tslint:disable-next-line:member-ordering
      static textHandler(message: any): string {
        return message.body;
      }
       disconnect()  {
        this.connect().pipe(first()).subscribe(client => client.disconnect(null));
    }
  }
  */
