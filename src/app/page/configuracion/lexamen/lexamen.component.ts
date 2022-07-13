import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Examen } from 'src/app/_model/configuracion/examen';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { ConfimService } from '../../component/confirm/confim.service';
import { SpinnerService } from '../../component/spinner/spinner.service';
import { CexamenComponent } from '../cexamen/cexamen.component';
import forms from 'src/assets/json/formulario.json';
import { Permiso } from 'src/app/_model/permiso';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lexamen',
  templateUrl: './lexamen.component.html',
  styleUrls: ['./lexamen.component.css']
})
export class LexamenComponent implements OnInit {

  permiso: Permiso = {};
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private usuarioService : UsuarioService,
    private configPermisoService : ConfigPermisoService,
    private confirmService : ConfimService,
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
        curExamen: examen
      }
    });
  }

}
