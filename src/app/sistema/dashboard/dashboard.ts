import { Component, DestroyRef, inject } from '@angular/core';
import { type ChartData } from 'chart.js';
import { ChartjsComponent } from '@coreui/angular-chartjs';

@Component({
  selector: 'app-dashboard',
  imports: [ChartjsComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly #destroyRef = inject(DestroyRef);
  #timeoutID: ReturnType<typeof setTimeout> | undefined = undefined;

  constructor() {
    this.#destroyRef.onDestroy(() => {
      clearTimeout(this.#timeoutID);
    });
  }

  // Los datos que se van a dibujar en tu gráfico
  data: ChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: [40, 20, 12, 39, 10, 80, 40]
      },
      {
        label: 'My Second dataset',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(151, 187, 205, 1)',
        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
        pointBorderColor: '#fff',
        data: [50, 12, 28, 29, 7, 25, 60]
      }
    ]
  };

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      console.log('handleChartRef', $chartRef);
      this.#timeoutID = setTimeout(() => {
        this.data?.labels?.push('August');
        this.data?.datasets[0].data.push(60);
        this.data?.datasets[1].data.push(20);
        $chartRef?.update();
        this.#timeoutID = undefined;
      }, 3000);
    }
  }
}
