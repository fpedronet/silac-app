import { TbMaestra } from "./combobox";

export class Distrito {
    constructor(){
        this.dpto = new Ubigeo();
        this.prov = new Ubigeo();
        this.dist = new Ubigeo();
    }
    dpto?: Ubigeo;
    prov?: Ubigeo;
    dist?: Ubigeo;
}

export class Ubigeo{
    constructor() {
        this.id ='';
        this.name ='';
        this.department_id ='';
        this.province_id =''
    }
    id?: string;
    name?: string;
    department_id?: string;
    province_id?: string;
}