import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import forms from 'src/assets/json/formulario.json';
import jsonEstado from 'src/assets/json/usuario/usuarioestado.json';

import { Permiso } from 'src/app/_model/permiso';
import { Interface } from 'src/app/_model/configuracion/interface';
import { environment } from 'src/environments/environment';

import { InterfaceService } from 'src/app/_service/configuracion/interface.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { LogeoService } from 'src/app/_service/configuracion/logeo.service';
import { FinterfaceComponent } from '../finterface/finterface.component';


@Component({
  selector: 'app-linterface',
  templateUrl: './linterface.component.html',
  styleUrls: ['./linterface.component.css']
})
export class LinterfaceComponent implements OnInit {

  dataSource: Interface[] = [];
  displayedColumns: string[] = ['nIdeInterface', 'vNombre', 'vDescripcion','swt','accion','mo'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  
  permiso: Permiso = {};
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private interfaceService: InterfaceService,
    private logeoService: LogeoService,
    private configPermisoService: ConfigPermisoService
  ) { }

  ngOnInit(): void {
    this.obtenerpermiso();
  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.usuario.codigo).subscribe(data=>{
      this.permiso = data;
    });   
  }

  cargarFiltro(){
    let filtro = this.logeoService.sessionFiltro();
    if(filtro!=null){ 
      localStorage.setItem(environment.CODIGO_FILTRO, filtro![0]+"|"+filtro![1]+"|"+filtro![2]);
    }else{
      localStorage.setItem(environment.CODIGO_FILTRO, ""+"|"+""+"|"+"2");
    }
  }

  ngAfterViewInit() {  
    this.cargarFiltro();
    this.interfaceService = new InterfaceService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          let filtro = this.logeoService.sessionFiltro();

          return this.interfaceService!.listar(
            filtro![0],
            filtro![1],
            filtro![2],
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(res => {
           this.loading = false;
           this.existRegistro = res === null;

          if (res === null) {
            return [];
          }

          this.countRegistro = res.pagination.total;
          return res.items;
        }),
      ).subscribe(data => (this.dataSource = data));
  
  }

  actualizar(){
    this.ngAfterViewInit();
  }

  abrirBusqueda(){
    const dialogRef =this.dialog.open(FinterfaceComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){
        this.paginator.pageIndex = 0,
        this.paginator.pageSize = 5
        this.ngAfterViewInit();
        }
    })
  }

  getClassEstado(idEstado: number){
    var clase: string = '';
    var objEstado = jsonEstado.find((e: any) => e.nIdEstado === idEstado);
    if(objEstado !== undefined){
      clase = objEstado.class;
    }
    return clase;
  }

}
