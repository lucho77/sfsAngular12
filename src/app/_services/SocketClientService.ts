
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Message, StompConfig, StompHeaders } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { devolverProyecto } from '../util/proyectoUtil';
import { User } from '../_models';
import { ChatUtilDTO } from '../_models/chatUtilDTO';
import { LoginDto } from '../_models/loginDto';
import { SocketClientState } from './SocketClientState';
import { webSocket } from 'rxjs/webSocket';
import { send } from 'process';

@Injectable({
    providedIn: 'root'
  })
  export class SocketClientService {
    private url = 'ws://localhost:9335/ms_notification/sfs-websocket';
    private socket$: Observable<any>;

    private state: BehaviorSubject<SocketClientState>;
    constructor(public http: HttpClient) {
      if(environment.chat===true){
        this.socket$ = this.createWebSocket();
      }  
    }

    private createWebSocket(): Observable<any> {
      const socket = new WebSocket(this.url);

  return new Observable(observer => {
    socket.onopen = (event) => {
      console.log('WebSocket connection established.');
      const message = { type: 'connect', data: this.createDataUser };
      socket.send(JSON.stringify(message));
    };

    socket.onmessage = (event) => {
      observer.next(event);
    };

    socket.onerror = (event) => {
      observer.error(event);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
      observer.complete();
    };

    return () => {
      console.log('WebSocket connection terminated.');
      socket.close();
    };
  }).pipe(
    filter((event: any) => event.type === 'message'),
    map((event: any) => JSON.parse(event.data))
  );
    }
  
    public getSocket(): Observable<any> {
      return this.socket$;
    }

    public createDataUser(){
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
        return u;
      }
   
  }
