import { pagination } from "../pagination";
import { Persona } from "../persona";
import { ResultadoExamen } from "./resultadoExamen";

export class Orden extends Persona  {
    nIdOrden?: number;
    nCantMuestras?: number;
    swt?: number;
    nNumero?: number;
    vCodBarras?: string;
    vCodBarras2?: string;
    vObservaciones?: string;
    nIdUsuReg?: number;
    nIdUsuMod?: number;
    dFecOrden?: Date;
    vFecOrden?: string;
    // nCodMedico?:number;
    // vCodTipoMuestra?: string;
    // vObsHistorial?: string;
    nIdEstado?: number;
    vEstado?: string;
    vExamen?: string;
    vResultado?: string;
    vUndMed?: string;
    Flag?: string;
    vHC?: string;
    dFecha?: Date;
    vCama?: string;

    resultadoExamen?: ResultadoExamen;
    listaResultadoExamen?: ResultadoExamen[];

   
    vTipDocumento?: string;
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