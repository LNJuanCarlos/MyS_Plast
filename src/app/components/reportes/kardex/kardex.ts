import { Producto } from "../../producto/producto";
import { Sector } from "../../sector/sector";
import { Transaccion } from "../../transaccion/transaccion";

export class Kardex{
    id:number;
    condicion:string;
    operacion:string;
    fecha:string;
    stockfecha:number;
    cantidad:number;
    id_SECTOR:Sector;
    id_PRODUCTO: Producto;
    id_TRAN: Transaccion;
}