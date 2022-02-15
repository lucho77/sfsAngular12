import { MetodoDTO } from './metodoDTO';

export interface ButtonDTO {
    metodoDTO: MetodoDTO;
    bottonVolver: boolean;
    guardarYvolver: boolean;
    etiquetaBoton: String;
    headerColumnaLink: string;
    posicion: number;
    bottonVolverHistorico: boolean;
    saveUpdate: boolean;
}

