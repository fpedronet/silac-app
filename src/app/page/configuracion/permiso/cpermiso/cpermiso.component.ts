import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { MenuDto } from 'src/app/_model/configuracion/menu';
import { Perfil, PerfilResponse } from 'src/app/_model/configuracion/perfil';
import { PermisoService } from 'src/app/_service/configuracion/permiso.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cpermiso',
  templateUrl: './cpermiso.component.html',
  styleUrls: ['./cpermiso.component.css']
})
export class CpermisoComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  idperfil?: number;
  nombreperfil?: string;
  listaPerfil: Perfil[] = [];
  listaMenu: MenuDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notifierService : NotifierService,
    private dialog: MatDialog,
    private spinner : SpinnerService,
    private permisoService : PermisoService,
  ) { }

  ngOnInit(): void {
    this.listar();
  }

  listar(){ 
    this.spinner.showLoading();
    this.permisoService.listar(0).subscribe(data=>{
      this.idperfil = data.nIdPerfil;
      this.nombreperfil = data.vDescripcion;
      this.listaPerfil = data.listaPerfil!;
      this.listaMenu = data.listaMenu!;

      this.spinner.hideLoading();
    });  
  }

  listarMenu(id: number){    

    // $(this).addClass("selected").siblings().removeClass("selected");

    this.idperfil = id;
    this.spinner.showLoading();
    this.permisoService.listar(id).subscribe(data=>{
      this.nombreperfil = data.vDescripcion;
      this.listaMenu = data.listaMenu!;

      this.spinner.hideLoading();
    });  
  }

  seleccionarMenu(id: string, seleccionado: boolean){
    var result  = this.listaMenu.filter(y=>y.vCodPantalla == id)[0];
    result!.seleccionado= (seleccionado==false)? true : false;
  }

  guardar(){
    let model = new PerfilResponse();
    model.nIdPerfil = this.idperfil;
    model.listaMenu = this.listaMenu;

    this.spinner.showLoading();
    this.permisoService.guardar(model).subscribe(data=>{
      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
      this.spinner.hideLoading();

      if(data.typeResponse==environment.EXITO){
        this.listarMenu(this.idperfil!);        
      }
    });
  }

}
