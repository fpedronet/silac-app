import { environment } from 'src/environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NotifierService } from '../component/notifier/notifier.service';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { SpinnerService } from '../component/spinner/spinner.service';
import { LogeoService } from 'src/app/_service/configuracion/logeo.service';

export type ChartOptions = {
  series: any;
  labels: any;
  chart: any;
  responsive: any;
  dataLabels: any;
  plotOptions: any;
  yaxis: any;
  xaxis: any;
  fill: any;
  tooltip: any;
  stroke: any;
  legend: any;
};

@Component({
  selector: 'app-inicio',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private logeoService : LogeoService,
    private spinner: SpinnerService,
    private notifier: NotifierService,
  ) { }
  
  usuario?: string = ''
  imgeinicio: string =environment.UrlImage + "home-bg-img.png";

  ngOnInit(): void {

    this.usuario = this.logeoService.sessionUsuario()?.nombreConocido;

  }

}
