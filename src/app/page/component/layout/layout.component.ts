import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';
import { environment } from 'src/environments/environment';
import forms from 'src/assets/json/formulario.json';

import { ConfigPermisoService } from './../../../_service/configpermiso.service';

import { MenuResponse } from 'src/app/_model/configuracion/menu';
import { MatDialog } from '@angular/material/dialog';
import { LogeoService } from 'src/app/_service/configuracion/logeo.service';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinner : SpinnerService,
    private ConfigPermisoService : ConfigPermisoService,
    private logeoService : LogeoService
  ) { }

  menus: MenuResponse = {};
  codigo?:string;
  panelOpenState = false;
  count=false;
  empresa?: string = "";
  logo?: string =environment.UrlImage + "logoMenu.png";
  user?: string =environment.UrlImage + "userMenu.png";
  username: string = "";
  userdni: string = "";
  isshow: boolean = false;
  interval:any;

  ngOnInit(): void {
    this.listar();   
  }

  listar(){
 
    let session = this.logeoService.sessionUsuario();

    if(session!=null){
      this.username= session.nombreConocido.toUpperCase();
      this.userdni =  session.documento;

      this.spinner.showLoading();
      this.ConfigPermisoService.listar().subscribe(data=>{
    
        this.menus.listaMenu = data.listaMenu;

        this.spinner.hideLoading();
      });
    }else{
      localStorage.clear();
      this.router.navigate(['']);
    }  
  }

  clearLocalStore(){
    this.isshow = false;
    localStorage.setItem(environment.CODIGO_FILTRO, "");    
  }

  closeLogin(){
    this.isshow = false;
    localStorage.clear();
    window.location.reload();
  }


  abrirmenu(){

    if(this.isshow){
      this.isshow = false; 
    }else{
      this.isshow = true;  
    }
  }
}
