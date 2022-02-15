import { NotificaPojoDTO } from './notificaPojoDTO';
import { ChatPojoDTO } from './chatPojoDTO';
export  interface ChatUtilDTO {
     metodo: string;
     username: string;
     para: string;
     mensaje: string;
     dataSource: string;
     token: string;
     idUsuarioUra: number;
     webServicesAddress: string;
     packageModel: string;
     notificaPojo: NotificaPojoDTO;
     chatPojo: ChatPojoDTO;
     chatPojos: ChatPojoDTO[];

}
