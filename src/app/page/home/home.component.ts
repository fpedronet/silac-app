import { environment } from 'src/environments/environment';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
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
    private usuarioService: UsuarioService,
    private spinner: SpinnerService,
    private notifier: NotifierService,
  ) { }
  
  usuario?: string = ''
  imgeinicio: string =environment.UrlImage + "home-bg-img.png";

  ngOnInit(): void {

    this.usuario = this.usuarioService.sessionUsuario()?.nombreConocido;

  }

}
