import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import forms from 'src/assets/json/formulario.json';

import { Usuario, UsuarioRequest } from 'src/app/_model/configuracion/usuario';

import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { Permiso } from 'src/app/_model/permiso';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';


@Component({
  selector: 'app-lusuario',
  templateUrl: './lusuario.component.html',
  styleUrls: ['./lusuario.component.css']
})
export class LusuarioComponent implements OnInit {

  dataSource: Usuario[] = [];
  displayedColumns: string[] = ['nIdUsuario', 'vDocumento', 'vApPaterno', 'vApMaterno', 'vPrimerNombre', 'vSexo', 'vFechaNac','vUsuario','accion'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  permiso: Permiso = {};
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,    
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private configPermisoService: ConfigPermisoService
  ) { }

  ngOnInit(): void {
    this.obtenerpermiso();
  }

  obtenerpermiso(){
    this.spinner.showLoading();
    this.configPermisoService.obtenerpermiso(forms.usuario.codigo).subscribe(data=>{
      this.permiso = data;
       this.spinner.hideLoading();
    });   
  }


  ngAfterViewInit() {  
    this.usuarioService = new UsuarioService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.usuarioService!.listar(
            "",
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(res => {
          console.log(res);
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


}
