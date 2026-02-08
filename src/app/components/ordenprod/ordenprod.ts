import { Itemordenprod } from "../itemordenprod/itemordenprod";
import { Natural } from "../natural/natural";
import { Sector } from "../sector/sector";

export class Ordenprod{

    id_ORDENPROD:string;
    fecha:string;
    nro_ORDENPROD:string;
    estado:string;
    desc_ORDENPROD:string;
    id_SECTOR:Sector;
    id_SECTORINSUMOS:Sector;
    id_PERSONA: Natural;
    reg_USER: string;
    fech_REG_USER: string;
    mod_USER: string;
    fech_MOD_USER: string;
    items: Array<Itemordenprod> = [];

}