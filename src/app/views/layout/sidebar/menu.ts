import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Inicio',
    isTitle: true
  },
  {
    label: 'Dashboard',
    icon: 'home',
    link: '/dashboard'
  },
  {
    label: 'Administración',
    isTitle: true
  },
  {
    label: 'Personas',
    icon: 'users',
    subItems: [
      {
        label: 'Natural',
        link: 'natural',
      },
      {
        label: 'Juridíca',
        link: 'juridica',
      },
    ]
  },
 
  {
    label: 'Almacén',
    isTitle: true
  },
  {
    label: 'Productos',
    icon: 'package',
    link: 'producto'
  },
  {
    label: 'Mantenimiento',
    icon: 'settings',
    subItems: [
      {
        label: 'Actividad',
        link: 'actividad',
      },
      {
        label: 'Almacen',
        link: 'almacen',
      },
      {
        label: 'Sector',
        link: 'sector',
      },
      {
        label: 'Centro de Costo',
        link: 'centrocosto',
      },
      {
        label: 'Categoria',
        link: 'categoria',
      },
      {
        label: 'Unidad de Medida',
        link: 'unmedida',
      },
      {
        label: 'Marca',
        link: 'marca',
      },
    ]
  },
  
  {
    label: 'Transacciones',
    isTitle: true,
  },
  {
    label: 'Transacciones',
    icon: 'arrow-right-circle',
    subItems: [
      {
        label: 'Ingresos',
        link: '/generalwi/ingreso',
      },
      {
        label: 'Egresos',
        link: '/generalws/egreso',
      },
      {
        label: 'Transferencias',
        link: '/generalwt/transferencia',
      },
    ]
  },
  {
    label: 'Inventario Físico',
    icon: 'file-plus',
    link: '/generalif/inventariofisico'
  },

  {
    label: 'Producción',
    isTitle: true,
  },
  {
    label: 'Ordenes de Producción',
    icon: 'file-text',
    link: '/generalop/ordenprod'
  },
  {
    label: 'Recetas',
    isTitle: true,
  },
  {
    label: 'Recetas de Producción',
    icon: 'file-text',
    link: '/generalrc/recetaprod'
  },
  {
    label: 'Reportes Almacén',
    isTitle: true,
  },
  {
    label: 'Reportes',
    icon: 'pie-chart',
    subItems: [
      {
        label: 'Stock',
        link: '/stock',
      },
      {
        label: 'Kardex',
        link: '/kardex',
      },
      /*{
        label: 'Gastos x Almacén',
        link: '/gastos',
      },
      {
        label: 'In. Por Sub. Almacen',
        link: '/ingresosalmacen',
      },
      {
        label: 'Stock x Lotes',
        link: '/stocklotes'
      }*/
    ]
  },
  
  {
    label: 'Compras',
    isTitle: true,
  },
  {
    label: 'Ordenes de Compra',
    icon: 'file-text',
    link: '/generaloc/ordencompra'
  },
  {
    label: 'Usuarios',
    isTitle: true,
  },
  {
    label: 'Usuarios',
    icon: 'user-plus',
    link: '/generalus/usuario'
  },
];
