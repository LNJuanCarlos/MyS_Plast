import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Transferencia } from './transferencia/transferencia';
import { Egreso } from './egreso/egreso';
import { Ingreso } from './ingreso/ingreso';
import { OrdenCompra } from './ordencompra/ordencompra';
import { Ordenprod } from './ordenprod/ordenprod';
import { Recetaprod } from './recetaprod/recetaprod';
import { Inventariofisico } from './inventariofisico/inventariofisico';
/*import { WhIngreso } from './whingreso/whingreso';
import { Whegreso } from './whegreso/whegreso';
import { transferencia } from './transferencia/transferencia';
import { OrdenCompra } from './ordencompra/ordencompra';
import { Ordenprod } from './ordenprod/ordenprod';*/
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: 'root'
  })
  export class ReportsService {

    imageToShow: any;
    imageToShow2: any;
    
  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.getImage()
  }


  getLogo(): Observable<Blob> {
    return this.http.get('assets/images/MySLogoOriginal.png', { responseType: 'blob' });
  }

  getLogo2(): Observable<Blob> {
    return this.http.get('assets/images/LetrasMYSPlast.png', { responseType: 'blob' });
  }

  getImage() {
    this.getLogo().subscribe(
      res => {
        this.createImageFromBlob(res);

      }, err => {
        console.log(err);
      }
    );
    this.getLogo2().subscribe(
      res => {
        this.createImageFromBlob2(res);

      }, err => {
        console.log(err);
      }
    );
  }

  private transFormDate(date: string | Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss') || '';
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  createImageFromBlob2(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow2 = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  openPDF(docDefinition: any) {
    let pdf = pdfMake.createPdf(docDefinition);
    pdf.open();
  }

  getIngresoPDF(ingreso: Ingreso): any {


    if (ingreso.proveedor=null) {
      return {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        content: [
          {
            columns: [
              [
              {
                image: this.imageToShow,
                width: 100,
                alignment: 'left',
                margin: [0, 0, 0, 0],
              },
              {
                image: this.imageToShow2,
                width: 300,
                alignment: 'rigth',
                margin: [0, 0, 0, 0]
              }
              ],
              [
                {
                    margin: [180, 0, 0, 10], //350 - 160
                    text: [{ text: 'FECHA TRANSACCIÓN: ', bold: true }, this.transFormDate(ingreso.fechatran)]
                  },
                {
                  margin: [170, 0, 0, 0], //350 - 160
                  table: {
                    widths: [200],
                    body: [
                      [{ text: 'RUC: ' + 20602674488, fontSize: 14, bold: true, alignment: 'center' }],
                      [{ text: 'NOTA DE INGRESO', fontSize: 16, bold: true, alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }],
                      [{ text: 'N° ' + ingreso.nro_TRAN, fontSize: 14, bold: true, alignment: 'center' }],

                    ]
                  }
                }
              ]
            ]
          },
          {
            text: 'Datos del Ingreso de Mercadería',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            margin: [0, 30, 0, 15]
          },
          {
            columns: [
              [
                { text: [{ text: 'Responsable: ', bold: true },ingreso.id_PERSONA.nombres + ' ' + ingreso.id_PERSONA.ape_PAT + ' ' + ingreso.id_PERSONA.ape_MAT]},
                { text: [{ text: 'Nro. Documento: ', bold: true },ingreso.id_PERSONA.nrodoc]},
                { text: [{ text: 'Teléfono: ', bold: true },ingreso.id_PERSONA.telefono]},
              ],
              [ 
                { text: [{ text: 'Proveedor: ', bold: true },ingreso.proveedor.razonsocial]},
                { text: [{ text: 'Nro. Documento: ', bold: true },ingreso.proveedor.nrodoc]},
                { text: [{ text: 'Dirección: ', bold: true },ingreso.proveedor.direccion]},
                { text: [{ text: 'Teléfono: ', bold: true },ingreso.proveedor.telefono]},
              ],
              [
                { text: [{ text: 'Almacén: ', bold: true },ingreso.id_SECTOR.id_ALMACEN.nom_ALMACEN]},
                { text: [{ text: 'Sub. Almacén: ', bold: true },ingreso.id_SECTOR.nom_SECTOR]},
                { text: [{ text: 'Tipo de Transacción: ', bold: true }, ingreso.categoriatransaccion.nombre] },
                { text: [{ text: 'Documento Referencia: ', bold: true }, ingreso.guia_REF] }
              ]
            ]
          },
          ,
          {
            text: 'Detalle del Ingreso de Mercadería',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            alignment: 'center',
            margin: [0, 15, 0, 15]
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto'],
              body: [
                [
                  //Columnas
                  { text: 'Línea', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Producto', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Marca', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Unid. Medida', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Cantidad', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }
                ],
                ...ingreso.items.map(p => ([{ text: p.linea, alignment: 'center' }, p.id_PRODUCTO.nombre, { text: p.id_PRODUCTO.id_MARCA.nom_MARCA, alignment: 'center' }, { text: p.id_PRODUCTO.id_UNMEDIDA.nom_UNMEDIDA, alignment: 'center' }, { text: p.cantidad, alignment: 'center' }])),
               
              ]
            }
          }
        ]
      }
    } else{
      return {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        content: [
          {
            columns: [
              [
              {
                image: this.imageToShow,
                width: 100,
                alignment: 'left',
                margin: [0, 0, 0, 0],
              },
              {
                image: this.imageToShow2,
                width: 300,
                alignment: 'rigth',
                margin: [0, 0, 0, 0]
              }
              ],
              [
                {
                    margin: [180, 0, 0, 10], //350 - 160
                    text: [{ text: 'FECHA TRANSACCIÓN: ', bold: true }, this.transFormDate(ingreso.fechatran)]
                  },
                {
                  margin: [170, 0, 0, 0], //350 - 160
                  table: {
                    widths: [200],
                    body: [
                      [{ text: 'RUC: ' + 20602674488, fontSize: 14, bold: true, alignment: 'center' }],
                      [{ text: 'NOTA DE INGRESO', fontSize: 16, bold: true, alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }],
                      [{ text: 'N° ' + ingreso.nro_TRAN, fontSize: 14, bold: true, alignment: 'center' }],

                    ]
                  }
                }
              ]
            ]
          },
          {
            text: 'Datos del Ingreso de Mercadería',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            margin: [0, 30, 0, 15]
          },
          {
            columns: [
              [
                { text: [{ text: 'Responsable: ', bold: true },ingreso.id_PERSONA.nombres + ' ' + ingreso.id_PERSONA.ape_PAT + ' ' + ingreso.id_PERSONA.ape_MAT]},
                { text: [{ text: 'Nro. Documento: ', bold: true },ingreso.id_PERSONA.nrodoc]},
                { text: [{ text: 'Teléfono: ', bold: true },ingreso.id_PERSONA.telefono]},
              ],
              [
                { text: [{ text: 'Almacén: ', bold: true },ingreso.id_SECTOR.id_ALMACEN.nom_ALMACEN]},
                { text: [{ text: 'Sub. Almacén: ', bold: true },ingreso.id_SECTOR.nom_SECTOR]},
                { text: [{ text: 'Tipo de Transacción: ', bold: true }, ingreso.categoriatransaccion.nombre] },
                { text: [{ text: 'Documento Referencia: ', bold: true }, ingreso.guia_REF] }
              ]
            ]
          },
          ,
          {
            text: 'Detalle del Ingreso de Mercadería',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            alignment: 'center',
            margin: [0, 15, 0, 15]
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto'],
              body: [
                [
                  //Columnas
                  { text: 'Línea', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Producto', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Marca', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Unid. Medida', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Cantidad', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }
                ],
                ...ingreso.items.map(p => ([{ text: p.linea, alignment: 'center' }, p.id_PRODUCTO.nombre, { text: p.id_PRODUCTO.id_MARCA.nom_MARCA, alignment: 'center' }, { text: p.id_PRODUCTO.id_UNMEDIDA.nom_UNMEDIDA, alignment: 'center' }, { text: p.cantidad, alignment: 'center' }])),
               
              ]
            }
          }
        ]
      }
    }
  }

  getOrdenprodPDF(ordenprod: Ordenprod): any {
    if (ordenprod) {
      return {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        content: [
          {
            columns: [
              [ {
                image: this.imageToShow,
                width: 100,
                alignment: 'left',
                margin: [0, 0, 0, 0],
              },
              {
                image: this.imageToShow2,
                width: 300,
                alignment: 'rigth',
                margin: [0, 0, 0, 0]
              }
              ],
              [
                {
                    margin: [180, 0, 0, 10], //350 - 160
                    text: [{ text: 'FECHA TRANSACCIÓN: ', bold: true }, this.transFormDate(ordenprod.fecha)]
                  },
                {
                  margin: [170, 0, 0, 0], //350 - 160
                  table: {
                    widths: [200],
                    body: [
                      [{ text: 'RUC: ' + 20602674488, fontSize: 14, bold: true, alignment: 'center' }],
                      [{ text: 'ORDEN DE PRODUCCIÓN', fontSize: 16, bold: true, alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }],
                      [{ text: 'N° ' + ordenprod.nro_ORDENPROD, fontSize: 14, bold: true, alignment: 'center' }],

                    ]
                  }
                }
              ]
            ]
          },
          {
            text: 'Datos de la Orden de Producción',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            margin: [0, 30, 0, 15]
          },
          {
            columns: [
              [
                { text: [{ text: 'Responsable: ', bold: true },ordenprod.id_PERSONA.nombres + ' ' + ordenprod.id_PERSONA.ape_PAT + ' ' + ordenprod.id_PERSONA.ape_MAT]},
                { text: [{ text: 'Nro. Documento: ', bold: true },ordenprod.id_PERSONA.nrodoc]},
                { text: [{ text: 'Teléfono: ', bold: true },ordenprod.id_PERSONA.telefono]},
              ],
              [
                { text: [{ text: 'Almacén: ', bold: true },ordenprod.id_SECTOR.id_ALMACEN.nom_ALMACEN]},
                { text: [{ text: 'Sub. Almacén: ', bold: true },ordenprod.id_SECTOR.nom_SECTOR]},
                { text: [{ text: 'Descripción: ', bold: true }, ordenprod.desc_ORDENPROD] }
              ]
            ]
          },
          ,
          {
            text: 'Detalle de la Orden de Producción',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            alignment: 'center',
            margin: [0, 15, 0, 15]
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto'],
              body: [
                [
                  //Columnas
                  { text: 'Línea', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Producto', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Marca', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Unid. Medida', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Cantidad', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }
                ],
                ...ordenprod.items.map(p => ([{ text: p.line, alignment: 'center' }, p.id_PRODUCTO.nombre, { text: p.id_PRODUCTO.id_MARCA.nom_MARCA, alignment: 'center' }, { text: p.id_PRODUCTO.id_UNMEDIDA.nom_UNMEDIDA, alignment: 'center' }, { text: p.cantidad, alignment: 'center' }])),
               
              ]
            }
          }
        ]
      }
    }
  }

  getEgresoPDF(egreso: Egreso): any {
    if (egreso) {
      return {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        content: [
          {
            columns: [
              [{
                image: this.imageToShow,
                width: 100,
                alignment: 'left',
                margin: [0, 0, 0, 0]
              },
              {
                image: this.imageToShow2,
                width: 300,
                alignment: 'rigth',
                margin: [0, 0, 0, 0]
              }
              ],
              [
                {
                    margin: [180, 0, 0, 10], //350 - 160
                    text: [{ text: 'FECHA TRANSACCIÓN: ', bold: true }, this.transFormDate(egreso.fechatran)]
                  },
                {
                  margin: [170, 0, 0, 0], //350 - 160
                  table: {
                    widths: [200],
                    body: [
                      [{ text: 'RUC: ' + 20602674488, fontSize: 14, bold: true, alignment: 'center' }],
                      [{ text: 'NOTA DE EGRERSO', fontSize: 16, bold: true, alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }],
                      [{ text: 'N° ' + egreso.nro_TRAN, fontSize: 14, bold: true, alignment: 'center' }],

                    ]
                  }
                }
              ]
            ]
          },
          {
            text: 'Datos del Ingreso de Mercadería',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            margin: [0, 30, 0, 15]
          },
          {
            columns: [
              [
                { text: [{ text: 'Responsable: ', bold: true },egreso.id_PERSONA.nombres + ' ' + egreso.id_PERSONA.ape_PAT + ' ' + egreso.id_PERSONA.ape_MAT]},
                { text: [{ text: 'Nro. Documento: ', bold: true },egreso.id_PERSONA.nrodoc]},
                { text: [{ text: 'Teléfono: ', bold: true },egreso.id_PERSONA.telefono]},
              ],
              [
                { text: [{ text: 'Almacén: ', bold: true },egreso.id_SECTOR.id_ALMACEN.nom_ALMACEN]},
                { text: [{ text: 'Sub. Almacén: ', bold: true },egreso.id_SECTOR.nom_SECTOR]},
               // { text: [{ text: 'Centro Costo: ', bold: true },egreso.id_CENTROCOSTO.nom_CENTROCOSTO]}
              ]
            ]
          },
          ,
          {
            text: 'Detalle de la egreso de Mercadería',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            alignment: 'center',
            margin: [0, 15, 0, 15]
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto'],
              body: [
                [
                  //Columnas
                  { text: 'Línea', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Producto', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Marca', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Unid. Medida', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Cantidad', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }
                ],
                ...egreso.items.map(p => ([{ text: p.linea, alignment: 'center' }, p.id_PRODUCTO.nombre, { text: p.id_PRODUCTO.id_MARCA.nom_MARCA, alignment: 'center' }, { text: p.id_PRODUCTO.id_UNMEDIDA.nom_UNMEDIDA, alignment: 'center' }, { text: p.cantidad, alignment: 'center' }])),
               
              ]
            }
          }
        ]
      }
    }
  }

  getTransferenciaPDF(transferencia: Transferencia): any {
    if (transferencia) {
      return {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        content: [
          {
            columns: [
              [{
                image: this.imageToShow,
                width: 100,
                alignment: 'left',
                margin: [0, 0, 0, 0]
              },
              {
                image: this.imageToShow2,
                width: 300,
                alignment: 'rigth',
                margin: [0, 0, 0, 0]
              }
              ],
              [
                {
                    margin: [180, 0, 0, 10], //350 - 160
                    text: [{ text: 'FECHA TRANSACCIÓN: ', bold: true }, this.transFormDate(transferencia.fechatran)]
                  },
                {
                  margin: [170, 0, 0, 0], //350 - 160
                  table: {
                    widths: [200],
                    body: [
                      [{ text: 'RUC: ' + 20602674488, fontSize: 14, bold: true, alignment: 'center' }],
                      [{ text: 'NOTA DE TRANSFERENCIA', fontSize: 16, bold: true, alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }],
                      [{ text: 'N° ' + transferencia.nro_TRAN, fontSize: 14, bold: true, alignment: 'center' }],

                    ]
                  }
                }
              ]
            ]
          },
          {
            text: 'Datos del Ingreso de Mercadería',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            margin: [0, 30, 0, 15]
          },
          {
            columns: [
              [
                { text: [{ text: 'Responsable: ', bold: true },transferencia.id_PERSONA.nombres + ' ' + transferencia.id_PERSONA.ape_PAT + ' ' + transferencia.id_PERSONA.ape_MAT]},
                { text: [{ text: 'Nro. Documento: ', bold: true },transferencia.id_PERSONA.nrodoc]},
                { text: [{ text: 'Teléfono: ', bold: true },transferencia.id_PERSONA.telefono]},
              ],
              [
                { text: [{ text: 'Almacén Origen: ', bold: true },transferencia.id_SECTOR.id_ALMACEN.nom_ALMACEN]},
                { text: [{ text: 'Sub. Almacén Origen: ', bold: true },transferencia.id_SECTOR.nom_SECTOR]},
              ],
              [
                { text: [{ text: 'Almacén Destino: ', bold: true },transferencia.id_SECTORDEST.id_ALMACEN.nom_ALMACEN]},
                { text: [{ text: 'Sub. Almacén Destino: ', bold: true },transferencia.id_SECTORDEST.nom_SECTOR]},
              ]
            ]
          },
          ,
          {
            text: 'Detalle del Ingreso de Mercadería',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            alignment: 'center',
            margin: [0, 15, 0, 15]
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto'],
              body: [
                [
                  //Columnas
                  { text: 'Línea', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Producto', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Marca', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Unid. Medida', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Cantidad', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }
                ],
                ...transferencia.items.map(p => ([{ text: p.linea, alignment: 'center' }, p.id_PRODUCTO.nombre, { text: p.id_PRODUCTO.id_MARCA.nom_MARCA, alignment: 'center' }, { text: p.id_PRODUCTO.id_UNMEDIDA.nom_UNMEDIDA, alignment: 'center' }, { text: p.cantidad, alignment: 'center' }])),
               
              ]
            }
          }
        ]
      }
    }
  }


  getOrdenCompraPDF(ordencompra: OrdenCompra): any {
    if (ordencompra) {
      return {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        content: [
          {
            columns: [
              [{
                image: this.imageToShow,
                width: 100,
                alignment: 'left',
                margin: [0, 0, 0, 0]
              },
              {
                image: this.imageToShow2,
                width: 300,
                alignment: 'rigth',
                margin: [0, 0, 0, 0]
              },
              {
                text: [{ text: 'Dirección Fiscal: MZA. 165 LOTE. 36 A.H. HUAYCAN (2DO PISO LOTE 36 UCV 165 ZONA L HUAYCAN) LIMA - LIMA - ATE', bold: true }],
                alignment: 'rigth',
                margin: [0, 0, 0, 0]
              }
              ],
              [
                {
                    margin: [180, 0, 0, 10], //350 - 160
                    text: [{ text: 'FECHA ORDEN DE COMPRA: ', bold: true }, this.transFormDate(ordencompra.fecha)]
                  },
                {
                  margin: [170, 0, 0, 0], //350 - 160
                  table: {
                    widths: [200],
                    body: [
                      [{ text: 'RUC: ' + 20602674488, fontSize: 14, bold: true, alignment: 'center' }],
                      [{ text: 'ORDEN DE COMPRA', fontSize: 16, bold: true, alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }],
                      [{ text: 'N° ' + ordencompra.nroordencompra, fontSize: 14, bold: true, alignment: 'center' }],

                    ]
                  }
                }
              ]
            ]
          },
          {
            text: 'Datos de la Orden de Compra',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            margin: [0, 30, 0, 15]
          },
          {
            columns: [
              [
                { text: [{ text: 'Responsable: ', bold: true },ordencompra.empleado.nombres + ' ' + ordencompra.empleado.ape_PAT + ' ' + ordencompra.empleado.ape_MAT]},
                { text: [{ text: 'Nro. Documento: ', bold: true },ordencompra.empleado.nrodoc]},
                { text: [{ text: 'Teléfono: ', bold: true },ordencompra.empleado.telefono]},
              ],
              [
                { text: [{ text: 'Proveedor: ', bold: true },ordencompra.proveedor.razonsocial]},
                { text: [{ text: 'Nro. Documento: ', bold: true },ordencompra.proveedor.nrodoc]},
                { text: [{ text: 'Dirección: ', bold: true },ordencompra.proveedor.direccion]},
                { text: [{ text: 'Teléfono: ', bold: true },ordencompra.proveedor.telefono]},
              ],
              [
                { text: [{ text: 'Almacén: ', bold: true },ordencompra.sector.id_ALMACEN.nom_ALMACEN]},
                { text: [{ text: 'Sub. Almacén: ', bold: true },ordencompra.sector.nom_SECTOR]}
              ]
            ]
          },
          ,
          {
            text: 'Detalle de la Orden de Compra',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            alignment: 'center',
            margin: [0, 15, 0, 15]
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  //Columnas
                  { text: 'Línea', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Producto', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Marca', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Unid. Medida', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Cantidad', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Precio', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Total', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }
                ],
                ...ordencompra.items.map(p => ([{ text: p.line, alignment: 'center' }, p.id_PRODUCTO.nombre, { text: p.id_PRODUCTO.id_MARCA.nom_MARCA, alignment: 'center' }
                , { text: p.id_PRODUCTO.id_UNMEDIDA.nom_UNMEDIDA, alignment: 'center' }, { text: p.cantidad, alignment: 'center' }
                , { text: p.precio, alignment: 'center' }, { text: p.total, alignment: 'center' }])),
               
              ]
            }
          }
        ]
      }
    }
  }

  getRecetaPDF(recetaprod: Recetaprod): any {
    if (recetaprod) {
      return {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        content: [
          {
            columns: [
              [ {
                image: this.imageToShow,
                width: 100,
                alignment: 'left',
                margin: [0, 0, 0, 0],
              },
              {
                image: this.imageToShow2,
                width: 300,
                alignment: 'rigth',
                margin: [0, 0, 0, 0]
              }
              ],
              [
                {
                    margin: [180, 0, 0, 10], //350 - 160
                    text: [{ text: 'FECHA DE CREACIÓN: ', bold: true }, this.transFormDate(recetaprod.fecha)]
                  },
                {
                  margin: [170, 0, 0, 0], //350 - 160
                  table: {
                    widths: [200],
                    body: [
                      [{ text: 'RUC: ' + 20602674488, fontSize: 14, bold: true, alignment: 'center' }],
                      [{ text: 'RECETA DE PRODUCCIÓN', fontSize: 16, bold: true, alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }],
                      [{ text: 'N° ' + recetaprod.nro_RECETA, fontSize: 14, bold: true, alignment: 'center' }],

                    ]
                  }
                }
              ]
            ]
          },
          {
            text: 'Datos de la Orden de Producción',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            margin: [0, 30, 0, 15]
          },
          {
            columns: [
              [ 
                { text: [{ text: 'Producto: ', bold: true },recetaprod.nom_RECETA]},
                { text: [{ text: 'Producto: ', bold: true },recetaprod.id_PRODUCTO.nombre]},
                { text: [{ text: 'Unidad de Medida: ', bold: true },recetaprod.id_PRODUCTO.id_UNMEDIDA.nom_UNMEDIDA]},
                { text: [{ text: 'Categoría: ', bold: true },recetaprod.id_PRODUCTO.id_CATEGORIA.nom_CATEGORIA]},
              ]
            ]
          },
          ,
          {
            text: 'Detalle de la Receta de Producción',
            style: 'sectionHeader',
            bold: true,
            decoration: 'underline',
            alignment: 'center',
            margin: [0, 15, 0, 15]
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Producto', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Marca', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Unid. Medida', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                  { text: 'Cantidad', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }
                ],
                ...recetaprod.items.map(p => ([ p.id_PRODUCTO.nombre, { text: p.id_PRODUCTO.id_MARCA.nom_MARCA, alignment: 'center' }, { text: p.id_PRODUCTO.id_UNMEDIDA.nom_UNMEDIDA, alignment: 'center' }, { text: p.cantidad, alignment: 'center' }])),
               
              ]
            }
          }
        ]
      }
    }
  }

  getInventarioFisicoPDF(inventariofisico: Inventariofisico): any {
    if (inventariofisico) {
      return {
        pageSize: 'A4',
        pageOrientation: 'portrait',
        content: [
          {
            columns: [
              [ {
                image: this.imageToShow,
                width: 50,
                alignment: 'left',
                margin: [0, 0, 0, 0],
              },
              {
                image: this.imageToShow2,
                width: 150,
                alignment: 'rigth',
                margin: [0, 0, 0, 0]
              },
              {
                text:[{text:'DISTRIBUCIÓN Y VENTAS DE BOLSAS PLÁSTICAS, DESCARTABLES, SERVILLETAS, CUCHARAS, PLATOS,' + 
                'VASOS, SORBETES, ROLLOS Y TODO TIPO DE MEDIDAS Y MARCAS', bold: true, fontSize: 8}]
              },
              {
                text:[{text:'MZA. 165 LOTE. 36 A.H. HUAYCAN (2DO PISO LOTE 36 UCV 165 ZONA L HUAYCAN) LIMA - LIMA - ATE', fontSize: 8}]
              }
              ],
              [
                {
                    margin: [110, 20, 0, 10], //350 - 160
                    text: [{ text: 'FECHA DE EMISIÓN: ', bold: true, fontSize: 8}, {text: this.transFormDate(inventariofisico.fecha), fontSize:8}]
                  },
                {
                  margin: [90, 0, 0, 0], //350 - 160
                  table: {
                    widths: [150],
                    body: [
                      [{ text: 'RUC: ' + 20548502471, fontSize: 8, bold: true, alignment: 'center' }],
                      [{ text: 'INVENTARIO FÍSICO', fontSize: 10, bold: true, alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }],
                      [{ text: 'N° ' + inventariofisico.nroinventario, fontSize: 8, bold: true, alignment: 'center' }],

                    ]
                  }
                }
              ]
            ]
          },
          {
            columns: [
              [ {
                margin: [0, 50, 0, 0], //350 - 160
                  table: {
                    widths: ['*'],
                    body: [
                      [{ text: 'DATOS DEL INVENTARIO FÍSICO', fontSize: 10, bold: true, alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }],
                      [
                      { text: [ { text: 'Responsable: ', bold: true, fontSize:9 }, 
                      { text: inventariofisico.responsable.nombres + ' ' + inventariofisico.responsable.ape_PAT + ' ' + inventariofisico.responsable.ape_MAT +'\n', fontSize:8} ,
                      { text: 'Almacen: ', bold: true, fontSize: 9}, { text: inventariofisico.id_SECTOR.id_ALMACEN.nom_ALMACEN +'\n', fontSize: 8},
                      { text: 'Sector: ', bold: true, fontSize: 9 }, { text: inventariofisico.id_SECTOR.nom_SECTOR, fontSize: 8}],
                       },
                    ]
                    ]
                  }
                }
              ]
            ]
          },
          ,
          {
            text: [ 'DETALLE DEL INVENTARIO FÍSICO'],
            style: 'sectionHeader',
            bold: true,
            fontSize:10,
            decoration: 'underline',
            alignment: 'center',
            margin: [0, 15, 0, 15]
          },
          {
            table: {
              fontSize:7,
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
              height:['*'],
              body: [
                
                  [ { text: 'PRODUCTO', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }, { text: 'MARCA', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }
                  , { text: 'UND', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }, { text: 'CANT. S', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                    { text: 'CANT. F', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },
                    { text: 'DIF', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' },{ text: 'OBSERVACIONES', alignment: 'center', fillColor: '#000000', color: '#FFFFFF' }],
                  [
                    [...inventariofisico.items.map(p => [{ text: p.id_PRODUCTO.nombre, fontSize:6.5,margin:[0, 5, 0, 0]}])],
                    [...inventariofisico.items.map(p => [{ text: p.id_PRODUCTO.id_MARCA.nom_MARCA, fontSize:6.5,margin:[0, 5, 0, 0] } ])],
                    [...inventariofisico.items.map(p => [{ text:p.id_PRODUCTO.id_UNMEDIDA.nom_UNMEDIDA, fontSize:6.5,margin:[0, 5, 0, 0] } ])],
                    [...inventariofisico.items.map(p => [{ text: p.cantidadsistema, fontSize:6.5, alignment: 'center',margin:[0, 5, 0, 0] } ])],
                    [...inventariofisico.items.map(p => [{ text: p.cantidad, fontSize:6.5, alignment: 'center',margin:[0, 5, 0, 0] } ])],
                    [...inventariofisico.items.map(p => [{ text: p.diferencia, fontSize:6.5, alignment: 'center',margin:[0, 5, 0, 0] } ])],
                    [...inventariofisico.items.map(p => [{ text: p.observacion, fontSize:6.5,margin:[0, 5, 0, 5] } ])]
                  ]
                
              
               
              ],
              
            }
          }
        ]
      }
    }
  }

  }  