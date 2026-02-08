import { Categoriatransaccion } from "../categoriatransaccion/categoriatransaccion";
import { Itemtransaccion } from "../itemtransaccion/itemtransaccion";
import { Natural } from "../natural/natural";
import { Sector } from "../sector/sector";
import { Tipotransaccion } from "../tipotransaccion/tipotransaccion";

export class Transaccion{
    id_TRAN: string;
    nro_TRAN: string;
    fechatran: string;
    desc_TRAN: string;
    estado: string;
    reg_USER: string;
    fech_REG_USER: string;
    mod_USER: string;
    fech_MOD_USER: string;
    id_SECTOR: Sector;
    id_PERSONA: Natural;
    id_TIPOTRANSACCION: Tipotransaccion;
    categoriatransaccion: Categoriatransaccion;
    items: Array<Itemtransaccion> = [];
    
}