import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
    private notifierService : NotifierService,
    private permisoService : PermisoService,
    private spinnerService : SpinnerService,
  ) { }

  ngOnInit(): void {
    this.listar();
  }

  listar(){ 
    this.permisoService.listar(0).subscribe(data=>{
      this.idperfil = data.nIdPerfil;
      this.nombreperfil = data.vDescripcion;
      this.listaPerfil = data.listaPerfil!;
      this.listaMenu = data.listaMenu!;
    });  
  }

  listarMenu(id: number){    
    this.idperfil = id;
    this.permisoService.listar(id).subscribe(data=>{
      this.nombreperfil = data.vDescripcion;
      this.listaMenu = data.listaMenu!;
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

    this.spinnerService.showLoading();
    this.permisoService.guardar(model).subscribe(data=>{
      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
      this.spinnerService.hideLoading();

      if(data.typeResponse==environment.EXITO){
        this.listarMenu(this.idperfil!);        
      }
    });
  }

}
