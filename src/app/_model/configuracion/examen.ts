import { TbMaestra } from "../combobox";

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
        this.vTipoRespuesta = '00003',
        this.vRespuesta = '',
        this.selected = true;
        this.listaEquivalencias = [];
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
    constructor(titulos: TbMaestra[], vacio: boolean = false) {
        this.nIdEquivResultado = 0;
        this.nIdExamen = 0;
        this.vResuNominal = '';
        this.nResuNumMin = 0;
        this.nResuNumMax = 18;
        this.vMensaje = '';

        this.listaRangos = [];
        titulos.forEach(e => {
            this.listaRangos?.push(new RangoResu(e.vValor!))
        });

        this.listaResuNominal = [];

        this.edicion = true;
        this.swt = 0;
        this.vacio = vacio;
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
    vacio?: boolean;
    listaResuNominal?: string[];

    edicion?: boolean;
}

export class RangoResu
{
    constructor(vEtiqueta: string){
        this.vEtiqueta = vEtiqueta;
    }
    vEtiqueta?: string;
    nMinVal: number = -1;
    nMaxVal: number = -1;
}