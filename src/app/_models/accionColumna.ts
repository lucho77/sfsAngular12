import { MetodoDTO } from './metodoDTO';
export interface AccionColumna {
columna: string;
type: string;
metatada: MetodoDTO;
idMetodo: number;
labelButton: string;
columnaAdicional: boolean;
columnaDownload: boolean;
columnaAccion: boolean;
}
