import { DescripcionToStringResponseDTO } from './descripcionToStringResponseDTO';

export interface ObtenerToStringResponseDTO {
    listToString: DescripcionToStringResponseDTO[];
    username: string;
    dataSource: string;
    webServicesAddress: string;
    modelPackage: string;
    idUsuarioUra: number;
    }
