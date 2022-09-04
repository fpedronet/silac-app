import { pagination } from "../pagination";
import { Paciente } from "./paciente";

export class Orden  {
    constructor(){
        this.paciente = new Paciente();
    }

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
    nCodMedico?:number;
    vCodTipoMuestra?: string;
    vObsHistorial?: string;
    nIdEstado?: number;
    nIdeAtencion?: number;
    vEstado?: string;
    nIdPaciente?: number;
    paciente?: Paciente;
    vExamen?: string;
    vResultado?: string;
    vUndMed?: string;
    Flag?: string;


    nIdPersona?: number;
    vNombreCompleto?: string;
    vTipDocu?: string;
    vTipDocumento?: string;
    vSexo?: string;
    vDocumento?: string;
    nEdad?: number;
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