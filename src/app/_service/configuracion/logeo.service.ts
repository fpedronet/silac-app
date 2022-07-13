import { dataCollection } from './../../_model/dataCollection';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

import { TokenUsuario, Usuario } from '../../_model/configuracion/usuario';
import { Response } from '../../_model/response';

@Injectable({
  providedIn: 'root'
})
export class LogeoService {

  private url: string = `${environment.UrlApi}/usuario`;
  
  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

  login(usuario: Usuario){
    let urls = `${this.url}/PostLogin`;

    return this.http.post<TokenUsuario>(urls, usuario);
  }

  refreshtoken(){
    let urls = `${this.url}/PostRefreshToken`;
    let model = new TokenUsuario();

    model.access_token = localStorage.getItem(environment.TOKEN_NAME)!;

    return this.http.post<TokenUsuario>(urls, model);
  }

  savetoken(token: TokenUsuario){
    localStorage.setItem(environment.TOKEN_NAME, token.access_token!);
  }

  sessionUsuario(){
    let helper = new JwtHelperService();
    let token = localStorage.getItem(environment.TOKEN_NAME);

      if(token!=null){
        let decodedToken = helper.decodeToken(token!);     
        return decodedToken;
      }else{
        return null
      }
  }

  sessionFiltro(){
    let filtro = localStorage.getItem(environment.CODIGO_FILTRO);

    let result = null;
    if(filtro!="" && filtro!=null && filtro!=undefined){
       result = filtro?.split('|');
    }      
    return result;
  }

  sessionDetalle(){
    let filtro = localStorage.getItem(environment.CODIGO_DETALLE);

    let result = null;
    if(filtro!="" && filtro!=null && filtro!=undefined){
       result = filtro?.split('|');
    }      
    return result;
  }

  closeLogin(){
    localStorage.clear();
    window.location.reload();
  }
}
