import { ChatPojoDTO } from './chatPojoDTO';
import { NotificaPojoDTO } from './notificaPojoDTO';
export interface ChatResponseDTO {
        deploying: boolean;
        esUsuario: boolean;
        chatsAbiertos: string[];
        chatPojo: ChatPojoDTO ;
        chatPojos: ChatPojoDTO [] ;
        notificaPojo: NotificaPojoDTO;
        notificaPojos: NotificaPojoDTO[];
        idAplica: number;
        username: string;
        dataSource: string;
        webServicesAddress: string;
        modelPackage: string;
        idUsuarioUra: number;
    }
