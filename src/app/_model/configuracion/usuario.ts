import { pagination } from "../pagination";
import { Persona } from "./persona";

export class Usuario extends Persona {
    nIdUsuario?: number;
    vUsuario? : string;
    vContrasena? : string;
    vNombreCompleto?: string;
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
    vData? : string;
}
