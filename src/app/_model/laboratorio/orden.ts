import { Persona } from "../configuracion/persona";
import { pagination } from "../pagination";

export class Orden  extends Persona {
    nIdOrden?: number;
    nCantMuestras?: number;
    swt?: number;
    nNumero?: number;
    vCodBarras?: string;
    vCodBarras2?: string;
    vObservaciones?: string;
    dFecOrden?: Date;
    vFecOrden?: string;
    nCodMedico?:number;
    vCodTipoMuestra?: string;
    vObsHistorial?: string;
    nIdEstado?: number;
    vEstado?: string
}

export class OrdenRequest extends pagination {
    nombre?: string;
    tipo?: string;
    area?: string;
    origen?: string;
    fechaIni?: string;
    fechaFin?: string;
}