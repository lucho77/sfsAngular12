/*
import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { User } from '../_models';
import { ChatDTO } from '../_models/chatDTO';
import { devolverProyecto } from '../pages/home/reportdef/reportdefUtil';
import { HttpClient } from '@angular/common/http';
import { ChatUtilDTO } from '../_models/chatUtilDTO';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    public wsService: WebsocketService, public http: HttpClient) {

    }
    sendMessage( chatUtil: ChatUtilDTO ) {
      this.wsService.emit( 'mensaje' , chatUtil );
    }
    getMessages() {
      return this.wsService.listen( 'mensaje-nuevo' );
    }

    getMessagesPrivate() {
      return this.wsService.listen( 'mensaje-privado' );
    }

    getUsuariosActivos() {
      return this.wsService.listen( 'usuarios-activos' );
    }

    emitirUsuariosActivos() {
      this.wsService.emit( 'obtener-usuarios');
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

}
*/
