import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NotifierService } from '../component/notifier/notifier.service';
import { SpinnerService } from '../component/spinner/spinner.service';

import { Usuario } from './../../_model/configuracion/usuario';
import { LogeoService } from 'src/app/_service/configuracion/logeo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private notifierService : NotifierService,
    private spinner : SpinnerService,
    private logeoService : LogeoService
  ) { }


  form: FormGroup = new FormGroup({});
  mensaje?: string;
  error?: string;
  logologin?: string =environment.UrlImage + "logo.png";
  input: any;

  ngOnInit(): void {

    this.form = new FormGroup({
      'usuario': new FormControl(""),
      'clave': new FormControl("")
    });
  }


  login(){
    let model = new Usuario();

    model.vUsuario = this.form.value['usuario'];
    model.vContrasena= this.form.value['clave'];

    if(model.vUsuario==null || model.vContrasena==""){
      if(model.vUsuario==null || model.vContrasena==""){
        this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingresa el usuario');
      }
      else if(model.vContrasena==null || model.vContrasena==""){
        this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingresa la contraseña');
      }
      this.spinner.hideLoading();

    }else{

      this.spinner.showLoading();
      this.logeoService.login(model).subscribe(data=>{

        if(data.typeResponse==environment.EXITO){
          localStorage.setItem(environment.TOKEN_NAME, data.access_token!);

          this.router.navigate(['/page/home']);
        }

        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.mensaje!);
        this.spinner.hideLoading();
        if(data.typeResponse!=environment.EXITO){
          this.input.focus();
          this.input.select();
        }
      }); 

    }
  }

  focus(name:any, input: any, btn:string=""){
    this.input = input;
    if(btn=="btnlogin"){
      this.login();
    }else{
      name.focus();
      name.select();
    }
  }

}
