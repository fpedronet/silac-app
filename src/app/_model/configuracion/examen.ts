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
        this.vTipoRespuesta = '00002',
        this.vRespuesta = '',
        this.selected = true;
        this.listaEquivalencias = [new EquivResultado()];
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
    listaEquivalencias?: EquivResultado[];
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

export class EquivResultado{
    constructor() {
        this.nIdEquivResultado = 0;
        this.nIdExamen = 0;
        this.vResuNominal = '';
        this.nResuNumMin = 0;
        this.nResuNumMax = 0;
        this.vMensaje = '';

        this.vCodVal1 = '00005'; this.nMinVal1 = 36.01; this.nMaxVal1 = 1999;
        this.vCodVal2 = '00001'; this.nMinVal2 = 0; this.nMaxVal2 = 20.2334;
        this.vCodVal3 = '00002'; this.nMinVal3 = 20.25; this.nMaxVal3 = 30;
        this.vCodVal4 = '00003'; this.nMinVal4 = 30.01; this.nMaxVal4 = 32.04;
        this.vCodVal5 = '00004'; this.nMinVal5 = 32.05; this.nMaxVal5 = 36;

        this.listaRangos = [];
        var ran: RangoResu;
        ran = {vEtiqueta: this.vCodVal1, nValMin: this.nMinVal1, nValMax: this.nMaxVal1}
        this.listaRangos.push(ran);
        ran = {vEtiqueta: this.vCodVal2, nValMin: this.nMinVal2, nValMax: this.nMaxVal2}
        this.listaRangos.push(ran);
        ran = {vEtiqueta: this.vCodVal3, nValMin: this.nMinVal3, nValMax: this.nMaxVal3}
        this.listaRangos.push(ran);
        ran = {vEtiqueta: this.vCodVal4, nValMin: this.nMinVal4, nValMax: this.nMaxVal4}
        this.listaRangos.push(ran);
        ran = {vEtiqueta: this.vCodVal5, nValMin: this.nMinVal5, nValMax: this.nMaxVal5}
        this.listaRangos.push(ran);

        this.edicion = true;
        this.swt = 0;
    }
    nIdEquivResultado?: number;
    nIdExamen?: number;
    vResuNominal?: string;
    nResuNumMin?: number;
    nResuNumMax?: number;
    vMensaje?: string;
    //Valores correspondientes a cada equivalencia
    vCodVal1?: string;
    nMinVal1?: number;
    nMaxVal1?: number;
    vCodVal2?: string; 
    nMinVal2?: number;
    nMaxVal2?: number;
    vCodVal3?: string;
    nMinVal3?: number;
    nMaxVal3?: number;
    vCodVal4?: string;
    nMinVal4?: number;
    nMaxVal4?: number;
    vCodVal5?: string;
    nMinVal5?: number;
    nMaxVal5?: number;
    listaRangos?: RangoResu[];
    swt?: number;

    edicion?: boolean;
}

export class RangoResu
{
    vEtiqueta?: string;
    nValMin?: number;
    nValMax?: number;
}