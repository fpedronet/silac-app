import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of as observableOf } from 'rxjs';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Examen, PerfilExamen } from 'src/app/_model/configuracion/examen';
import { ExamenService } from 'src/app/_service/configuracion/examen.service';
import { PermisoService } from 'src/app/_service/configuracion/permiso.service';
import { environment } from 'src/environments/environment';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-lperfilexamen',
  templateUrl: './lperfilexamen.component.html',
  styleUrls: ['./lperfilexamen.component.css']
})
export class LperfilexamenComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  edit: boolean = true;

  listaPerfil: PerfilExamen[] = [];
  curPerfil?: PerfilExamen = undefined;
  curListaExamenA: Examen[] = [];
  curListaExamenD: Examen[] = [];

  displayedColumnsP: string[] = ['vDescripcion', 'accion'];
  displayedColumnsA: string[] = ['vCodExamen','vDescripcion', 'vUndMed', 'vCodTipoMuestra', 'vCodAreaExamen', 'accion'];
  displayedColumnsD: string[] = ['vCodExamen','vDescripcion', 'vUndMed', 'vCodTipoMuestra', 'vCodAreaExamen', 'accion'];
  loadingP = true;
  existRegistroP = false;
  loadingE = true;
  countRegistroP = 0;

  @ViewChild(MatPaginator) paginatorP!: MatPaginator;
  @ViewChild(MatPaginator) paginatorE!: MatPaginator;
  @ViewChild(MatPaginator) paginatorD!: MatPaginator;

  @ViewChild(MatSort) sortP!: MatSort;
  @ViewChild(MatSort) sortD!: MatSort;

  @ViewChild('searchBarP') searchBarP!: ElementRef;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private notifierService : NotifierService,
    private dialog: MatDialog,
    private spinner : SpinnerService,
    private examenService : ExamenService,
  ) { }

  ngOnInit(): void {
    this.inicializar();
  }

  ngAfterViewInit(){
    this.listarP();
  }

  inicializar(){
    this.form = new FormGroup({
      'nIdPerfilExamen': new FormControl({ value: 0, disabled: false}),
      'vDescripcion': new FormControl({ value: '', disabled: !this.edit})
    });
  }

  listarP(search: string = ''){ 
    this.examenService = new ExamenService(this.http);
    this.sortP.sortChange.subscribe(() => (this.paginatorP.pageIndex = 0));
 
    var page = this.paginatorP.pageIndex;
    var pages =  this.paginatorP.pageSize;
    var column = (this.sortP.active == undefined)? '' : this.sortP.active
    var order = this.sortP.direction

    merge(this.sortP.sortChange, this.paginatorP.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.examenService!.listarPerfil(
            search, page, pages, column, order
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(res => {
           this.loadingP = false;
           this.loadingE = false;

          if (res === null || res.items.length === 0) {
            this.existRegistroP = false;
            return [];
          }
          
          this.existRegistroP = true;

          this.countRegistroP = res.pagination.total;
          return res.items;
        }),
      ).subscribe(data => (this.listaPerfil = data));
      
  }

  listarE(search:string = ''){
      var subString = search.toLowerCase();
      var filtroE = this.curPerfil?.listaExamenesA.filter(e =>
        e.vCodExamen?.toLowerCase().includes(subString) ||
        e.vDescripcion?.toLowerCase().includes(subString) ||
        e.vUndMed?.toLowerCase().includes(subString) ||
        e.vCodTipoMuestra?.toLowerCase().includes(subString) ||
        e.vCodAreaExamen?.toLowerCase().includes(subString)
      );

      this.curListaExamenA = filtroE === undefined ? [] : filtroE;
  }

  guardar(){
    let model = new PerfilExamen();
    model.nIdPerfilExamen = this.form.value['nIdPerfilExamen'];
    model.vDescripcion = this.form.value['vDescripcion'];
    model.listaExamenesA = this.curListaExamenA;
    model.listaExamenesD = this.curListaExamenD;

    this.spinner.showLoading();
    this.examenService.guardarPerfil(model).subscribe(data=>{
      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
      this.spinner.hideLoading();

      if(data.typeResponse==environment.EXITO){
        if(data.ide !== undefined){
          this.curPerfil = new PerfilExamen();
          this.curPerfil.nIdPerfilExamen = data.ide;
          this.form.patchValue({
            nIdPerfilExamen: data.ide
          });
        }
        
        this.searchBarP.nativeElement.value = '';
        this.listarP();
        this.spinner.hideLoading();
      }
      else{
        this.spinner.hideLoading();
      }
    });
  }

  limpiar(){
    this.curPerfil = undefined;
    this.curListaExamenA = [];
    this.curListaExamenD = [];

    this.form.patchValue({
      nIdPerfilExamen: 0,
      vDescripcion: ''
    });
  }

  buscaTextoP(event: Event) {  
    let data = (event.target as HTMLInputElement).value;
    this.listarP(data);
  }

  buscaTextoE(event: Event) {  
    let data = (event.target as HTMLInputElement).value;
    this.listarE(data);
  }

  buscaTextoD(event: Event) {  
    let data = (event.target as HTMLInputElement).value;
    //this.listarD(data);
  }

  seleccionaPerfil(perfil: PerfilExamen){
    this.curPerfil = perfil;
    
    this.form.patchValue({
      nIdPerfilExamen: perfil.nIdPerfilExamen,
      vDescripcion: perfil.vDescripcion,
    });

    this.obtenerExamenes(perfil.nIdPerfilExamen);
  }

  obtenerExamenes(id: number = 0){
    if(id > 0){
      this.spinner.showLoading();
      this.examenService.obtenerPerfil(id).subscribe(data=>{
        if(data!== undefined){
          this.curListaExamenA = data.listaExamenesA;          
          this.curListaExamenD = data.listaExamenesD;

          this.spinner.hideLoading();
        }
      });
    }
  }

  moverListaExamen(exa: Examen, haciaListaActuales: boolean){
    if(haciaListaActuales){
      var lstA = this.curListaExamenA.slice();
      lstA.push(exa);
      this.curListaExamenA = lstA;
      this.curListaExamenD = this.curListaExamenD.filter(e => e.nIdExamen !== exa.nIdExamen);
    }
    else{
      var lstD = this.curListaExamenD.slice();
      lstD.push(exa);
      this.curListaExamenD = lstD;
      this.curListaExamenA = this.curListaExamenA.filter(e => e.nIdExamen !== exa.nIdExamen);
    }
  }
}
