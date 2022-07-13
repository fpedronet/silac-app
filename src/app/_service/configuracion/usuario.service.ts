import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuarioRequest } from 'src/app/_model/configuracion/usuario';
import { dataCollection } from 'src/app/_model/dataCollection';
import { environment } from 'src/environments/environment';
import { Response } from '../../_model/response';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url: string = `${environment.UrlApi}/usuario`;
  
  constructor(
    private http: HttpClient
    ) { }

  listar(req: UsuarioRequest) {
  
    let urls = `${this.url}/GetAllUsuario`;
    return this.http.post<dataCollection>(urls,req);
  }

  guardar(model: Usuario){
    let urls = `${this.url}/PostSaveUsuario`;
    return this.http.post<Response>(urls, model);
  }
}
