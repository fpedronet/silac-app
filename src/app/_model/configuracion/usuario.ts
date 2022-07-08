import { Byte } from "@angular/compiler/src/util";

export class Usuario{
    nIdUsuario?: number;
    vUsuario? : string;
    vContrasena? : string;
}

export class TokenUsuario{
    idPersona? : number;
    idUsuario? : number;
    nombreConocido? : string;
    documento? : string;
    access_token? : string;
    typeResponse? : number;
    mensaje? : string;
}

export class EmpresaPorUsuario{
    codigo? : string;
    documento? : string;
    nombreEmpresa? : string;
    razonSocial? : string;
    otro1? : string;
    tipoEmpresa?: string;
    foto? : Byte[];
    logo? : string;
    longitud? : string;
    latitud? : string;
    otro2? : string;
    fecha1? : string;
    otro3? : string;
    fecha3? : string;
}