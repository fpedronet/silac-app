import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { LogeoService } from 'src/app/_service/configuracion/logeo.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-finterface',
  templateUrl: './finterface.component.html',
  styleUrls: ['./finterface.component.css']
})
export class FinterfaceComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<FinterfaceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinnerService : SpinnerService,
    private logeoService: LogeoService,
  ) { }

  codigo? : string;
  nombre? : string;
  estado?: number;

  ngOnInit(): void {
    this.obtener();
  }

  obtener(){  
    this.spinnerService.showLoading();
    let filtro = this.logeoService.sessionFiltro();
    if(filtro !== null){
      this.codigo = filtro![0];
      this.nombre = filtro![1];
      this.estado = parseInt(filtro![2]);
    }
    this.spinnerService.hideLoading();
  }

  selectestado(id: number){
    this.estado= id;
  }

  limpiar(){
    this.codigo = "";
    this.nombre = "";
    this.estado = 2;
  }

  buscar(){
    localStorage.setItem(environment.CODIGO_FILTRO, (this.codigo===undefined?'':this.codigo)+"|"+(this.nombre===undefined?'':this.nombre)+"|"+this.estado);

    this.dialogRef.close();
    
  }

}
