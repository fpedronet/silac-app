import { pagination } from "../pagination";

export class Interface{
    nIdeInterface?: number;
    vNombre?: string;
    vDescripcion?: string;
    swt? : number;   
    nIdUsuReg? : number;   
    dFecUsuReg?: Date;
    nIdUsuMod? : number;   
    dFecUsuMod?: Date;
}

export class InterfaceRequest extends pagination {
    documento? : string;
    data? : string;
    estado? : string;
}