import { AndroidDTO } from './androidDTO';
import { Subject } from 'rxjs';
import { Prueba } from './prueba';

declare global {
    interface Window {
         // creación de tipos
         geoUpdate: Prueba['geoUpdate'];
         geoUpdate2: Prueba['geoUpdate2'];
         enX: Prueba['geoCoordenada_X_Aumentadaen10'];
         enY: Prueba['geoCoordenada_Y_Aumentadaen10'];
         resPer: Prueba['resPersonalizada'];

         // Creacion de código dinámico
         // FuncionPersonalizada: Function;
    }
}
