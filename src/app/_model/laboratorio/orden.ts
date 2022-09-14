import { Examen } from "../configuracion/examen";
import { pagination } from "../pagination";
import { Persona } from "../persona";
import { ResultadoExamen } from "./resultadoExamen";

export class Orden extends Persona  {
    constructor(){
        super();
        this.listaExamenes = [];
    }

    nIdOrden?: number;
    nNumero?: string;
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

    listaExamenes?: OrdenExamen[];
   
    //resultadoExamen?: ResultadoExamen;
    //listaResultadoExamen?: ResultadoExamen[];
}

export class OrdenExamen{
    constructor(nIdOrden?: number, nIdExamen?: number){
        this.nIdOrden = nIdOrden;
        this.nIdExamen = nIdExamen;
    }
    nIdOrden?: number;
    nIdExamen?: number;
    nIncDetalle?: number;
    vResultado?: string;
    vResultadoAtm?: string;
    vResultado2?: string;
    vResultado2Atm?: string;
}

export class OrdenRequest extends pagination {
    nombre?: string;
    tipo?: string;
    area?: string;
    origen?: string;
    fechaIni?: string;
    fechaFin?: string;
}