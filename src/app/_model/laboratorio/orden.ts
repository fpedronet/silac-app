import { pagination } from "../pagination";
import { Persona } from "../persona";
import { ResultadoExamen } from "./resultadoExamen";

export class Orden extends Persona  {
    nIdOrden?: number;
    nNumero?: number;
    vHC?: string;
    nCantMuestras?: number;
    dFecOrden?: Date;
    vFecOrden?: string;
    vCodBarras?: string;
    vObservaciones?: string;
    nIdEstado?: number;
    vProcedencia?: string;
    vCama?: string;
    vOrigen?: string;
    vServicio?: string
    vEstado?: string;
    nFlagHemograma?: number;
    nFlagOrina?: number;

    vExamen?: string;
    vResultado?: string;
    vUndMed?: string;
    Flag?: string;

    vDetalle?: string;
    curUsuario?: number;
   
    resultadoExamen?: ResultadoExamen;
    listaResultadoExamen?: ResultadoExamen[];
}

export class OrdenRequest extends pagination {
    nombre?: string;
    tipo?: string;
    area?: string;
    origen?: string;
    fechaIni?: string;
    fechaFin?: string;
}