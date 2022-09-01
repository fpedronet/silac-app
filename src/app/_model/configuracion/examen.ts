export class Examen{
    constructor() {
        this.nIdExamen = 0
        this.vCodExamen = '',
        this.vDescripcion = '',
        this.vCodAreaExamen = '',
        this.vCodTipoMuestra = '',
        this.vFormato = '',
        this.vFormula = '',
        this.vAbreviatura = '',
        this.vUndMed = '',
        this.vRangoRef = '',
        this.vCodSubGrupo = '',
        this.vTipoRespuesta = '',
        this.vRespuesta = '',
        this.selected = true;
    }
    nIdExamen?: number;
    vCodExamen?: string;
    vDescripcion?: string;
    vAbreviatura?: string;
    vCodExterno?: string;
    nOrden?: number;
    vUndMed?: string;
    vCodTipoMuestra?: string;
    vRangoRef?: string;
    vCodAreaExamen?: string;
    vFormula?: string;
    vFormato?: string;
    vCodSubGrupo?: string;
    vTipoRespuesta?: string;
    vRespuesta?: string;
    vDetalles?: string;
    nIncDetalle?: number;
    selected?: boolean;
}

export class PerfilExamen{
    constructor() {
        this.nIdPerfilExamen = 0
        this.vDescripcion = '',
        this.listaExamenesA = [];
        this.listaExamenesD = [];
    }
    nIdPerfilExamen?: number;
    vDescripcion?: string;
    listaExamenesA: Examen[];
    listaExamenesD: Examen[];
}