import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Examen } from 'src/app/_model/configuracion/examen';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { ConfimService } from '../../component/confirm/confim.service';
import { SpinnerService } from '../../component/spinner/spinner.service';
import { CexamenComponent } from '../cexamen/cexamen.component';
import forms from 'src/assets/json/formulario.json';
import { Permiso } from 'src/app/_model/permiso';
import { Router } from '@angular/router';
import { LogeoService } from 'src/app/_service/configuracion/logeo.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { ExamenService } from 'src/app/_service/configuracion/examen.service';

@Component({
  selector: 'app-lexamen',
  templateUrl: './lexamen.component.html',
  styleUrls: ['./lexamen.component.css']
})
export class LexamenComponent implements OnInit {

  permiso: Permiso = {};

  dataSource: Examen[] = [];
  displayedColumns: string[] = ['vCodExamen','vDescripcion', 'vAbreviatura', 'vUndMed', 'vCodTipoMuestra', 'vCodAreaExamen', 'vFormula', 'accion'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private logeoService : LogeoService,
    private configPermisoService : ConfigPermisoService,
    private confirmService : ConfimService,
    private examenService : ExamenService
  ) { }

  ngOnInit(): void {
    this.obtenerpermiso();
  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.examen.codigo).subscribe(data=>{
      this.permiso = data;
    });   
  }

  abrirDetalle(examen?: Examen){

    const dialogRef = this.dialog.open(CexamenComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: {
        curExamen: examen,
        edit: this.permiso.guardar
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){

        this.paginator.pageIndex = 0,
        //this.paginator.pageSize = 5
        this.ngAfterViewInit();
        }
    })
  }

  ngAfterViewInit(search: string = '') {

    this.examenService = new ExamenService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
 
    var page = this.paginator.pageIndex;
    var pages =  this.paginator.pageSize;
    var column = (this.sort.active == undefined)? '' : this.sort.active
    var order = this.sort.direction

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.examenService!.listar(
            search, page, pages, column, order
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

  buscaTexto(event: Event) {
  
    let data = (event.target as HTMLInputElement).value;
    this.ngAfterViewInit(data);
  }

  actualizar(){
    this.ngAfterViewInit();
  }
}
