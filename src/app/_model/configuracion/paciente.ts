import { Persona } from "./persona";

export class Paciente extends Persona {
    nIdPaciente?: number;
    nIdSede?: number;
    vHistoria? : string;
    swt? : number;
}