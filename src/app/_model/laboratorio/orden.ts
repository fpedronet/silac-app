import { pagination } from "../pagination";
import { Persona } from "../persona";
import { ResultadoExamen } from "./resultadoExamen";

export class Orden extends Persona  {
    nIdOrden?: number;
    nCantMuestras?: number;
    nNumero?: number;
    vObservaciones?: string;
    dFecOrden?: Date;
    vFecOrden?: string;
    nIdEstado?: number;
    vEstado?: string;
    vExamen?: string;
    vResultado?: string;
    vUndMed?: string;
    Flag?: string;
    vHC?: string;
    vCama?: string;

    nIdUsuReg?: number;
    nIdUsuMod?: number;
   
    resultadoExamen?: ResultadoExamen;
    listaResultadoExamen?: ResultadoExamen[];

    vProcedencia?: string;
    vServicio?: string;
    vCodArea?: string;
    vArea?: string;
    vOrigen?: string;
    vCodOrigen?: string;
    vCodAtencion?: string;
    vDetalle?: string;
}

export class OrdenRequest extends pagination {
    nombre?: string;
    tipo?: string;
    area?: string;
    origen?: string;
    fechaIni?: string;
    fechaFin?: string;
}