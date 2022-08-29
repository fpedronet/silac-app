import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { LogeoService } from 'src/app/_service/configuracion/logeo.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forden',
  templateUrl: './forden.component.html',
  styleUrls: ['./forden.component.css']
})
export class FordenComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<FordenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinnerService : SpinnerService,
    private logeoService: LogeoService,
  ) { }

  nombre? : string;
  tipo? : string;
  estado?: number;
  area?: string;
  origen?: string;

  fechaIni?: Date;
  fechaSelectIni?: Date;

  fechaFin?: Date;
  fechaSelectFin?: Date;

  fechaMax?: Date;

  ngOnInit(): void {
    this.fechaMax = new Date();
  }

  onDateChange(){
    this.fechaIni = this.fechaSelectIni;
    this.fechaFin=  this.fechaSelectFin;    
  }

  limpiar(){

  }

  buscar(){
    //localStorage.setItem(environment.CODIGO_FILTRO, (this.documento===undefined?'':this.documento)+"|"+(this.nombre===undefined?'':this.nombre)+"|"+this.estado);

    this.dialogRef.close();
    
  }

}
