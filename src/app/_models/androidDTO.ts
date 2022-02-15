import { DataToken } from './dataToken';
import { PosicionDTO } from './posicionDTO';

export interface AndroidDTO {
  timeSecs: number;
  distanceMts: number;
  context: DataToken;
  current: PosicionDTO;
  destination: PosicionDTO;
}
