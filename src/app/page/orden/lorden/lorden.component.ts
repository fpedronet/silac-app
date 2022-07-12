import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Orden } from 'src/app/_model/laboratorio/orden';
import { NotifierService } from '../../component/notifier/notifier.service';
import { SpinnerService } from '../../component/spinner/spinner.service';

@Component({
  selector: 'app-lorden',
  templateUrl: './lorden.component.html',
  styleUrls: ['./lorden.component.css']
})
export class LordenComponent implements OnInit {

  dataSource: Orden[] = [];
  displayedColumns: string[] = ['codigo','natencion', 'fecha', 'documento', 'nombre', 'sexo', 'edad'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,    
    private notifierService : NotifierService,
    // private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
  }

  
  // ngAfterViewInit() {
  //   this.predonanteService = new PredonanteService(this.http);
  //   this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

  //   merge(this.sort.sortChange, this.paginator.page)
  //     .pipe(
  //       startWith({}),
  //       switchMap(() => {
  //         // this.loading = true;
  //         let filtro = this.usuarioService.sessionFiltro();
  //         let codigobanco = this.usuarioService.sessionUsuario().codigobanco;
          
  //         return this.predonanteService!.listar(
  //           codigobanco,
  //           parseInt(filtro![3]),
  //           parseInt(filtro![1]),
  //           parseInt(filtro![2]),
  //           filtro![0],
  //           new Date(filtro![4]),
  //           new Date(filtro![5]),
  //           this.paginator.pageIndex,
  //           this.paginator.pageSize
  //         ).pipe(catchError(() => observableOf(null)));
  //       }),
  //       map(res => {

  //          this.loading = false;
  //          this.existRegistro = res === null;

  //         if (res === null) {
  //           return [];
  //         }

  //         this.countRegistro = res.pagination.total;
  //         return res.items;
  //       }),
  //     ).subscribe(data => (this.dataSource = data));
      
  // }

}
