import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Chart } from 'chart.js';
import { TopProductosProduccion } from './topproductosproduccion';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public chart1: any = null;
  public chart2: any = null;
  public chart3: any = null;

  ordenesCompraPendientes: number = 0;
  ordenesProdPendientes: number = 0;
  inventariosPendientes: number = 0;

  dataLocal: number[] = [];
  dataExtranjera: number[] = [];

  dataTopProductosEgresos: number[] = [];
  labelTopProductosEgresos: string[] = [];

  dataTopProductosIngresos: number[] = [];
  labelTopProductosIngresos: string[] = [];

  top1ProductoProduccion: TopProductosProduccion = null;
  top2ProductoProduccion: TopProductosProduccion = null;

  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.obtenerPendientes();
    this.dashBoardGastosMesLocal();
    this.obtenerTopProductosEgresosIngresos();
    this.obtenerTopProductosProduccion();
  }

  // ===================== GASTOS MENSUALES =====================
  dashBoardGastosMesLocal() {

    // LIMPIEZA TOTAL (CLAVE)
    this.dataLocal = [];
    this.dataExtranjera = [];

    this.dashboardService.obtenerGastosMesLocal().subscribe(localData => {

      for (let i = 1; i <= 12; i++) {
        const obtenido = localData.find(e => e.mes === i);
        this.dataLocal.push(obtenido ? Number(obtenido.total) : 0);
      }

      this.dashboardService.obtenerGastosMesExtranjera().subscribe(extData => {

        for (let i = 1; i <= 12; i++) {
          const obtenido = extData.find(e => e.mes === i);
          this.dataExtranjera.push(obtenido ? Number(obtenido.total) : 0);
        }

        // DESTRUIR SI YA EXISTE
        if (this.chart1) {
          this.chart1.destroy();
        }

        this.chart1 = new Chart('canvas1', {
          type: 'line',
          data: {
            labels: this.meses,
            datasets: [
              {
                label: 'Soles',
                data: this.dataLocal,
                borderColor: '#d50000',
                backgroundColor: 'rgba(213,0,0,0.1)',
                fill: false,
                lineTension: 0.4
              },
              {
                label: 'Dólares',
                data: this.dataExtranjera,
                borderColor: '#fdd835',
                backgroundColor: 'rgba(253,216,53,0.1)',
                fill: false,
                lineTension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            },
            plugins: {
              legend: { position: 'top' },
              title: {
                display: true,
                text: 'Gastos Mensuales (Año Actual)'
              }
            }
          }
        });

      });
    });
  }

  // ===================== PENDIENTES =====================
  obtenerPendientes() {
    this.dashboardService.obtenerInventariosPendientes().subscribe(data => {
      this.inventariosPendientes = data.length;
    });

    this.dashboardService.obtenerOrdenesCompraPendientes().subscribe(data => {
      this.ordenesCompraPendientes = data.length;
    });

    this.dashboardService.obtenerOrdenProdPendientes().subscribe(data => {
      this.ordenesProdPendientes = data.length;
    });
  }

  // ===================== TOP PRODUCTOS =====================
  obtenerTopProductosEgresosIngresos() {

    // LIMPIEZA
    this.dataTopProductosEgresos = [];
    this.labelTopProductosEgresos = [];

    this.dashboardService.topProductosEgresos().subscribe(data => {

      for (let item of data) {
        this.dataTopProductosEgresos.push(Number(item.cantidad));
        this.labelTopProductosEgresos.push(item.nombre);
      }

      if (this.chart2) {
        this.chart2.destroy();
      }

      this.chart2 = new Chart('canvas2', {
        type: 'pie',
        data: {
          labels: this.labelTopProductosEgresos,
          datasets: [{
            data: this.dataTopProductosEgresos,
            borderWidth: 1,
            backgroundColor: ['#CB4335', '#1F618D', '#F1C40F', '#27AE60', '#884EA0']
          }]
        },
        options: {
          plugins: {
            legend: {
              onHover: this.handleHover,
              onLeave: this.handleLeave
            }
          }
        }
      });
    });

    // INGRESOS
    this.dataTopProductosIngresos = [];
    this.labelTopProductosIngresos = [];

    this.dashboardService.topProductosIngresos().subscribe(data => {

      for (let item of data) {
        this.dataTopProductosIngresos.push(Number(item.cantidad));
        this.labelTopProductosIngresos.push(item.nombre);
      }

      if (this.chart3) {
        this.chart3.destroy();
      }

      this.chart3 = new Chart('canvas3', {
        type: 'pie',
        data: {
          labels: this.labelTopProductosIngresos,
          datasets: [{
            data: this.dataTopProductosIngresos,
            borderWidth: 1,
            backgroundColor: ['#CB4335', '#1F618D', '#F1C40F', '#27AE60', '#884EA0']
          }]
        },
        options: {
          plugins: {
            legend: {
              onHover: this.handleHover,
              onLeave: this.handleLeave
            }
          }
        }
      });
    });
  }

  // ===================== EFECTOS PIE =====================
  handleHover(evt, item, legend) {
    legend.chart.data.datasets[0].backgroundColor.forEach((color, index, colors) => {
      colors[index] = index === item.index ? color : color + '4D';
    });
    legend.chart.update();
  }

  handleLeave(evt, item, legend) {
    legend.chart.data.datasets[0].backgroundColor.forEach((color, index, colors) => {
      colors[index] = color.replace('4D', '');
    });
    legend.chart.update();
  }

  // ===================== TOP PRODUCCIÓN =====================
  obtenerTopProductosProduccion() {
    this.dashboardService.topProductosProduccion().subscribe(data => {
      this.top1ProductoProduccion = data[0] || null;
      this.top2ProductoProduccion = data[1] || null;
    });
  }
}