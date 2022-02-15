import { FormdataReportdef } from './formdata';
    export interface AltaEdicionABMDTO {
        username: string;
        dataSource: string;
        webServicesAddress: string;
        modelPackage: string;
        idUsuarioUra: number;

        reportName: string;
        entity: string;
        viewName: string;
        alta: boolean;
        enviaParametrosGlobales: boolean;
        enviaParametros: boolean;
        list: FormdataReportdef[];
        global: FormdataReportdef[];
        id: number;
        idFilterPreseteo: number;
        idOnlyOwner: number;
        onlyOwner: boolean;
        onlyOwnerDay: boolean;
        campoOnlyOwner: string;
        campoDayOnlyOwner: string;
}
