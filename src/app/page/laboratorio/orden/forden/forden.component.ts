import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TbMaestra } from 'src/app/_model/combobox';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { LogeoService } from 'src/app/_service/configuracion/logeo.service';
import { TbmaestraService } from 'src/app/_service/tbmaestra.service';

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
    private tbmaestraService : TbmaestraService,
  ) { }

  nombre? : string;
  tipo? : string;
  estado?: string;
  area?: string;
  origen?: string;

  fechaIni?: Date;
  fechaSelectIni?: Date;

  fechaFin?: Date;
  fechaSelectFin?: Date;

  fechaMax?: Date;

  tablasMaestras = ['AREXA', 'ESOR','TIPO','ORIG'];
  listaArea?: TbMaestra[] = [];
  listaEstado?: TbMaestra[] = [];
  listaTipo?: TbMaestra[] = [];
  listaOrigen?: TbMaestra[] = [];

  ngOnInit(): void {
    this.fechaMax = new Date();
    this.obtener();
  }

  obtener(){
    this.spinnerService.showLoading();

    this.tbmaestraService.cargarDatos(this.tablasMaestras).subscribe(data=>{
      this.listaArea = this.obtenerSubtabla(data.items,'AREXA');
      this.listaEstado = this.obtenerSubtabla(data.items,'ESOR');
      this.listaTipo = this.obtenerSubtabla(data.items,'TIPO');
      this.listaOrigen = this.obtenerSubtabla(data.items,'ORIG');

      let filtro = this.logeoService.sessionFiltro();

      this.nombre= filtro![0];
      this.tipo= filtro![1];
      this.area= (filtro![2] =="")? "999" : filtro![2];
      this.origen= (filtro![3] =="")? "999" : filtro![3];
      this.estado=  "999"

      this.fechaSelectIni=new Date(filtro![4]);
      this.fechaIni=new Date(filtro![4]);

      this.fechaSelectFin=new Date(filtro![5]);
      this.fechaFin=new Date(filtro![5]);

      this.spinnerService.hideLoading();
    });
  }

  obtenerSubtabla(tb: TbMaestra[], cod: string){
    return tb.filter(e => e.vCodTabla?.toString()?.trim() === cod);
  }

  onSelectChange(id: string, select: string){
    if(select=='Tipo'){
      this.tipo= id;
    }else if(select=='Estado'){
      this.estado= id;
    }else if(select=='Area'){
      this.area= id;
    }
    else if(select=='Origen'){
      this.origen= id;
    }
  }

  onDateChange(){
    this.fechaIni = this.fechaSelectIni;
    this.fechaFin=  this.fechaSelectFin;    
  }

  limpiar(){

    this.nombre= "";
    this.tipo= "0001";
    this.area= "999";
    this.origen= "999";
    this.estado= "999"

    this.fechaSelectIni=new Date();
    this.fechaIni=new Date();

    this.fechaSelectFin=new Date();
    this.fechaFin=new Date();

    localStorage.setItem(environment.CODIGO_FILTRO, ""+"|"+this.tipo+"|"+""+"|"+""+"|"+this.fechaIni+"|"+this.fechaFin);
  }

  buscar(){
    localStorage.setItem(environment.CODIGO_FILTRO, this.nombre+"|"+this.tipo+"|"+this.area+"|"+this.origen+"|"+this.fechaIni+"|"+this.fechaFin);

    this.dialogRef.close();
    
  }

}
