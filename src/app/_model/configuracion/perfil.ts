import { MenuDto } from "./menu";

export class Perfil{
    nIdPerfil?: number;
    vDescripcion?: string;
    nIdUsuReg?: number;
    dFecUsuReg?: Date;
    nIdUsuMod?: number;
    dFecUsuMod?: Date;
    seleccionado?: boolean;
}

export class PerfilResponse{
    nIdPerfil?: number;
    vDescripcion?: string;
    listaPerfil?:Perfil[];
    listaMenu?:MenuDto[];
}