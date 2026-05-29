import { Component } from '@angular/core';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [ChartjsComponent, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  
  /**
   * AQUÍ DEBES CONECTAR EL BACKEND:
   * Los datos de 'labels' y 'datasets' deben venir de una petición GET a tu API.
   * Ejemplo: this.http.get('/api/stats/ventas-mensuales').subscribe(...)
   */

  // 1. Gráfico de Ventas Mensuales (Basado en orden_venta y orden_servicio)
  ventasChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ventas S/',
        backgroundColor: '#ff3b30', // Rojo de la empresa
        borderColor: '#ff3b30',
        data: [4500, 5200, 3800, 6100, 5900, 7200]
      }
    ]
  };

  // 2. Gráfico de Stock (Basado en tabla repuesto)
  stockChartData = {
    labels: ['En Stock', 'Bajo Stock', 'Sin Stock'],
    datasets: [
      {
        backgroundColor: ['#2eb85c', '#f9b115', '#e55353'],
        data: [150, 25, 5]
      }
    ]
  };

  // 3. Gráfico de Servicios por Estado (Basado en tabla orden_servicio)
  serviciosChartData = {
    labels: ['Pendiente', 'En Proceso', 'Terminado', 'Entregado'],
    datasets: [
      {
        backgroundColor: ['#3399ff', '#f9b115', '#2eb85c', '#636f83'],
        data: [10, 15, 30, 20]
      }
    ]
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  chartOptionsPie = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const
      }
    }
  };

  // Resumen de tarjetas
  stats = [
    { title: 'Ventas del Mes', value: 'S/ 7,200', icon: 'bi-cash-stack', color: 'text-success' },
    { title: 'Servicios Activos', value: '25', icon: 'bi-tools', color: 'text-primary' },
    { title: 'Productos Críticos', value: '12', icon: 'bi-exclamation-triangle', color: 'text-danger' },
    { title: 'Clientes Nuevos', value: '8', icon: 'bi-person-plus', color: 'text-info' }
  ];
}
