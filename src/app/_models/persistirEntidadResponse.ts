import { DataHijoDTO } from './dataHijoDTO';
export interface PersistirEntidadResponse {

    idClasePersistida: number;
    toStringClase: string;
    mensajeLogica: string;
    classFullParent: string;
    dataHijoDTO: DataHijoDTO;
}

