/*
import { Injectable } from '@angular/core';

// tslint:disable-next-line:import-blacklist
import { Observable, Subject } from 'rxjs/Rx';
import { WebSocketNewService } from './socket.services';

const CHAT_URL = 'wss://uixd.co.uk:50001';

@Injectable()
export class MessageService {
  public messages: Subject<any>;

  constructor(_websocket: WebSocketNewService) {
    this.messages = <Subject<any>>_websocket
      .connect(CHAT_URL)
      .map((response: MessageEvent): any => {
        return response.data;
      });
  }
}
*/
