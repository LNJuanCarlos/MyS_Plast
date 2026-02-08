import { Iteminventariofisico } from "../iteminventariofisico/iteminventariofisico";
import { Natural } from "../natural/natural";
import { Sector } from "../sector/sector";

export class Inventariofisico{

    id_INVENT: string;
    reg_USER: string;
    fech_REG_USER: string;
    mod_USER: string;
    fech_MOD_USER: string;
    nroinventario: string;
    fecha:string;
    estado:string;
    responsable:Natural;
    id_SECTOR:Sector;
    items: Array<Iteminventariofisico> = [];

}