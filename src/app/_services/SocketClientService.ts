
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Message, StompConfig, StompHeaders } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import { devolverProyecto } from '../util/proyectoUtil';
import { User } from '../_models';
import { ChatUtilDTO } from '../_models/chatUtilDTO';
import { LoginDto } from '../_models/loginDto';
import { SocketClientState } from './SocketClientState';


@Injectable({
    providedIn: 'root'
  })
  export class SocketClientService {
    private stompClient: Client;
    private socket:WebSocket;

    private state: BehaviorSubject<SocketClientState>;
    constructor(public http: HttpClient) {
    }

    public inicializar(){
      
      this.socket = new WebSocket("ws://localhost:9335/ms_notification/sfs-websocket");
      this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);

      this.socket.addEventListener("open", () => {
        this.state.next(SocketClientState.CONNECTED);
        console.log("Conexión establecida con el servidor WebSocket.");
        const user = JSON.parse (localStorage.getItem('currentUser'));
        const  loginDto = {} as LoginDto;
        loginDto.datasource = user.datasource;
        loginDto.idUsuarioUra=user.idUsuarioUra;
        loginDto.username=user.username;
        loginDto.mail=user.mail;
        loginDto.packageModel=user.packageModel;
        loginDto.token=user.token;
        loginDto.usuarioMesa=user.usuarioMesa;
        loginDto.webservice=user.webservice;
        const u = JSON.stringify(loginDto);
        this.socket.send(u);
});

socket.addEventListener("message", (event) => {
  console.log(`Mensaje recibido: ${event.data}`);
});

socket.addEventListener("close", () => {
  console.log("Conexión con el servidor WebSocket cerrada.");
});

socket.addEventListener("error", (error) => {
  console.error(`Error en la conexión con el servidor WebSocket: `);
});
      
   /*   
      const socket = new SockJS('http://localhost:9335/ms_notification/sfs-websocket');

    

      this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
      const user = localStorage.getItem('currentUser');
      const u = JSON.stringify(user);
      const stompConfig: StompConfig = {
        connectHeaders: {
          login: u
        }};
        const headers: StompHeaders = new StompHeaders();

      this.stompClient = new Client(stompConfig);

      this.stompClient.webSocketFactory = () => socket;
      this.stompClient.onConnect = (frame: any) => {
        console.log('Connected: ' + frame);
        this.state.next(SocketClientState.CONNECTED);

      };
      this.stompClient.activate();
      */

    }
    public connect(): Observable<WebSocket> {
      return new Observable<WebSocket>(observer => {
        this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
          observer.next(this.socket);
        });
      });
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
        this.connect().pipe(first()).subscribe(client => client.close());
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
          .subscribe(
            inst => inst.send({
              JSON.stringify(payload)
            }

            )                                               

          );
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
        this.connect().pipe(first()).subscribe(client => client.close());
    }
  }

