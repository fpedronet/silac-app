import { EmpresaPorUsuario } from "./usuario";

export class MenuResponse {
    listaMenu?:MenuDto[];
    listaConfigMenu?:ConfiguracionMenu[];
}

export class MenuDto {
    nIdAcceso? : number;
    swt?: number;
    vCodModulo?: string;
    vModulo?:string;
    vCodPantalla?:string;
    vPantalla?:string;
    vDescripcion?:string;
    vUrl?:string;
    vPermiso?:string;
    seleccionado?:boolean;
    listaSubMenu1?:SubMenu1Dto[]
}

export class SubMenu1Dto {
    nIdAcceso? : number;
    swt?: number;
    vCodModulo?: string;
    vModulo?:string;
    vCodPantalla?:string;
    vPantalla?:string;
    vDescripcion?:string;
    vUrl?:string;
    vPermiso?:string;
}

export class ConfiguracionMenu {
    nIdAcceso? : number;
    swt?: number;
    vCodModulo?: string;
    vModulo?:string;
    vCodPantalla?:string;
    vPantalla?:string;
    vDescripcion?:string;
    vUrl?:string;
    vPermiso?:string;
}
