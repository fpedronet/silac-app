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

@Component({
  selector: 'app-lperfilexamen',
  templateUrl: './lperfilexamen.component.html',
  styleUrls: ['./lperfilexamen.component.css']
})
export class LperfilexamenComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  edit: boolean = true;

  listaPerfil: PerfilExamen[] = [];
  curPerfil: PerfilExamen = new PerfilExamen();
  listaExamen: Examen[] = [];

  displayedColumnsP: string[] = ['vDescripcion', 'accion'];
  displayedColumnsE: string[] = ['vCodExamen','vDescripcion', 'vUndMed', 'vCodTipoMuestra', 'vCodAreaExamen', 'accion'];
  loading = true;
  existRegistro = false;
  countRegistroP = 0;

  @ViewChild(MatPaginator) paginatorP!: MatPaginator;
  //@ViewChild(MatPaginator) paginatorE1!: MatPaginator;
  //@ViewChild(MatPaginator) paginatorE2!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
    this.listarP();
  }

  ngAfterViewInit(){
    this.listarP();
  }

  inicializar(){
    this.form = new FormGroup({
      'nIdPerfilExamen': new FormControl({ value: this.curPerfil.nIdPerfilExamen, disabled: false}),
      'vDescripcion': new FormControl({ value: this.curPerfil.vDescripcion, disabled: !this.edit})
    });
  }

  listarP(search:string = ''){ 
    this.examenService = new ExamenService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginatorP.pageIndex = 0));
 
    var page = this.paginatorP.pageIndex;
    var pages =  this.paginatorP.pageSize;
    var column = (this.sort.active == undefined)? '' : this.sort.active
    var order = this.sort.direction

    merge(this.sort.sortChange, this.paginatorP.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.examenService!.listarPerfil(
            search, page, pages, column, order
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(res => {

           this.loading = false;
           this.existRegistro = res === null;

          if (res === null) {
            return [];
          }

          this.countRegistroP = res.pagination.total;
          return res.items;
        }),
      ).subscribe(data => (this.listaPerfil = data));
      
  }

  listarMenu(id: number){    

    // $(this).addClass("selected").siblings().removeClass("selected");

    this.spinner.showLoading();
    this.examenService.listar(id.toString()).subscribe(data=>{
      //this.listaMenu = data.listaMenu!;

      this.spinner.hideLoading();
    });  
  }

  seleccionarMenu(id: string, seleccionado: boolean){
    
    //var result  = this.listaMenu.filter(y=>y.vCodPantalla == id)[0];
    //result!.seleccionado= (seleccionado==false)? true : false;
  }

  guardar(){
    let model = new PerfilExamen();
    model.nIdPerfilExamen = this.form.value['nIdExamen'];
    model.vDescripcion = this.form.value['vDescripcion'];

    this.spinner.showLoading();
    this.examenService.guardarPerfil(model).subscribe(data=>{
      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
      this.spinner.hideLoading();

      if(data.typeResponse==environment.EXITO){
        if(data.ide !== undefined){
          this.curPerfil.nIdPerfilExamen = data.ide;
          this.form.patchValue({
            nIdExamen: data.ide
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
    this.curPerfil = new PerfilExamen();
    this.form.patchValue({
      nIdPerfilExamen: this.curPerfil.nIdPerfilExamen,
      vDescripcion: this.curPerfil.vDescripcion,
    });
  }

  step = 1;

  setStep(index: number) {
    this.step = index;
  }

  buscaTextoP(event: Event) {
  
    let data = (event.target as HTMLInputElement).value;
    this.listarP(data);
  }

  mostrarExamenes(perfil: PerfilExamen){
    this.curPerfil = perfil;
    this.form.patchValue({
      nIdPerfilExamen: perfil.nIdPerfilExamen,
      vDescripcion: perfil.vDescripcion,
    });
  }
}
