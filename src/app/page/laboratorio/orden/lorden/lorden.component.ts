import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';

import forms from 'src/assets/json/formulario.json';
import jsonEstado from 'src/assets/json/usuario/usuarioestado.json';

import { Orden } from 'src/app/_model/laboratorio/orden';
import { Permiso } from 'src/app/_model/permiso';

import { OrdenService } from 'src/app/_service/laboratorio/orden.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { LogeoService } from 'src/app/_service/configuracion/logeo.service';
import { environment } from 'src/environments/environment';
import { FordenComponent } from '../forden/forden.component';


@Component({
  selector: 'app-lorden',
  templateUrl: './lorden.component.html',
  styleUrls: ['./lorden.component.css']
})
export class LordenComponent implements OnInit {
  
  dataSource: Orden[] = [];
  displayedColumns: string[] = ['nNumero', 'vFecOrden', 'vDocumento','vNombreCompleto', 'vSexo','nEdad','vExamen','swt','vResultado','vUnidMed','Flag','accion','mo'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  permiso: Permiso = {};
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private ordenService: OrdenService,
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
    let fecha = new Date();

    if(filtro!=null){ 
      localStorage.setItem(environment.CODIGO_FILTRO, filtro![0]+"|"+filtro![1]+"|"+filtro![2]+"|"+filtro![3]+"|"+filtro![4]+"|"+filtro![5]);
    }else{
      localStorage.setItem(environment.CODIGO_FILTRO, ""+"|"+"0001"+"|"+""+"|"+""+"|"+fecha+"|"+fecha);
    }
  }

  ngAfterViewInit() {  
    this.cargarFiltro();
    this.ordenService = new OrdenService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          debugger;
          let filtro = this.logeoService.sessionFiltro();

          return this.ordenService!.listar(
            filtro![0],
            filtro![1],
            filtro![2],
            filtro![3],
            new Date(filtro![4]),
            new Date(filtro![5]),
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
    const dialogRef =this.dialog.open(FordenComponent, {
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
