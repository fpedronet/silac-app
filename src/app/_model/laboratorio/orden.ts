import { pagination } from "../pagination";

export class Orden {
    nIdOrden?: number;
    nNumero?: number;
}

export class OrdenRequest extends pagination {
    nNumero?: number;
}