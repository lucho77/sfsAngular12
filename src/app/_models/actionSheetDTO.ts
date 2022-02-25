import { ActionSheetDinamycImageDTO } from "./actionSheetDinamycImageDTO";


export interface ActionSheetDTO {
    campoPersistir: string;
	campoEvaluar: string;
	valorEvaluar: any;
	opcion1: ActionSheetDinamycImageDTO[];
	opcion2: ActionSheetDinamycImageDTO[];
}
