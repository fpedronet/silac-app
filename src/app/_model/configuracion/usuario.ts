import { Byte } from "@angular/compiler/src/util";
import { pagination } from "../pagination";
import { Persona } from '../persona';
import { Perfil } from './perfil';

export class Usuario extends Persona {
    nIdUsuario?: number;
    vUsuario? : string;
    vContrasena? : string;
    dFecUltConex?: Date;
    vCodExternoTipo? : string;
    vCodExternoNum? : string;
    vColegiatura? : string;
    nIdPerfil? : string;
    iFirma? : Byte;
    vFirma? : string;
    iFoto? : Byte;
    vFoto? : string;
    listaPerfil?:Perfil[];
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

export class UsuarioRequest extends pagination {
    documento? : string;
    data? : string;
    estado? : string;
}
