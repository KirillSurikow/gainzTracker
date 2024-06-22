import { Component } from '@angular/core';
import { ChartDataService } from '../services/chartData/chart-data.service';
import { Chart, LinearScale, LineController, LineElement, PointElement, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import { Router } from '@angular/router';

Chart.register(LinearScale, LineController, LineElement, PointElement, CategoryScale, Title, Tooltip, Legend);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  data: Array<Object> = [];
  labels: any = [];
  diagramm: Chart | undefined;
  chartWidth : string | undefined;
  chartHeight : string | undefined;



  constructor(private chart: ChartDataService, private router: Router) {
    this.chart.chartDataPreparedEvent.subscribe((signal) => {
      if (signal) {
        this.data = Object.keys(this.chart.aggregatedData).flatMap((key) => {
          return this.chart.aggregatedData[key];
        });
        this.labels = this.chart.labels;
        this.createChart();
      }
    });
    window.addEventListener('resize',()=>{
      this.calculateChartSize();
    })
  }

  createChart() {
    document.getElementById('trainingChart')?.remove();
    const ctx = document.createElement('canvas');
    ctx.id = 'trainingChart';
    document.getElementById('chartContainer')?.append(ctx);
    this.calculateChartSize();
    this.diagramm = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: this.chart.macroModus? this.chart.createDataSetsForMonth() : this.chart.createDataSetsForWeek(),
        labels: this.chart.macroModus? this.labels : this.chart.labels,

      },
      options : {
        scales : this.chart.generateScales(),
        responsive : true,
        maintainAspectRatio: false,
      }
    });
    console.log(this.diagramm.data.datasets)
  }

  calculateChartSize(){
    let chartWidthNumber = window.innerWidth * 80 / 100;
    let chartWidth = `${chartWidthNumber}px`;
    let chartHeight = `${chartWidthNumber * 75 / 100}px`;
    const chart = document.getElementById('trainingChart');
    if(chart){
      chart!.style.width = chartWidth;
      chart!.style.maxHeight = `${window.innerHeight - 100}px`;
      chart!.style.height = chartHeight;
    }
  }

  goToProgress(){
    this.router.navigateByUrl('home/progress')
  }
}

