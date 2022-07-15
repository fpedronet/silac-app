import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Examen, PerfilExamen } from 'src/app/_model/configuracion/examen';
import { ExamenService } from 'src/app/_service/configuracion/examen.service';
import { PermisoService } from 'src/app/_service/configuracion/permiso.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lperfilexamen',
  templateUrl: './lperfilexamen.component.html',
  styleUrls: ['./lperfilexamen.component.css']
})
export class LperfilexamenComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  idperfil?: number;
  nombreperfil?: string;
  listaPerfil: PerfilExamen[] = [];
  listaExamen: Examen[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notifierService : NotifierService,
    private dialog: MatDialog,
    private spinner : SpinnerService,
    private examenService : ExamenService,
  ) { }

  ngOnInit(): void {
    this.listar();
  }

  listar(){ 
    this.spinner.showLoading();
    this.examenService.listarPerfil().subscribe(data=>{
      /*this.idperfil = data.nIdPerfil;
      this.nombreperfil = data.vDescripcion;
      this.listaPerfil = data.listaPerfil!;
      this.listaMenu = data.listaMenu!;¨*/

      this.spinner.hideLoading();
    });  
  }

  listarMenu(id: number){    

    // $(this).addClass("selected").siblings().removeClass("selected");

    this.idperfil = id;
    this.spinner.showLoading();
    this.examenService.listar(id.toString()).subscribe(data=>{
      this.nombreperfil = '';
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
    model.nIdPerfilExamen = this.idperfil;
    model.vDescripcion = '';

    this.spinner.showLoading();
    this.examenService.guardar(model).subscribe(data=>{
      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
      this.spinner.hideLoading();

      if(data.typeResponse==environment.EXITO){
        this.listarMenu(this.idperfil!);        
      }
    });
  }

  step = 1;

  setStep(index: number) {
    this.step = index;
  }
}
