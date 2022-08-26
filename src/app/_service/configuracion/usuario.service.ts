import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
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

  listar(documento: string, data: string, estado: string, page: number,pages: number, column: string, order: SortDirection) {
  
    let urls = `${this.url}/GetAllUsuario`;
    let req = new UsuarioRequest();
    req.documento = documento;
    req.data = data;
    req.estado = (estado=="2")? "" : estado;
    req.page = page;
    req.pages =  pages;
    req.column = (column==undefined)?'':column;
    req.order = order;

    return this.http.post<dataCollection>(urls,req);
  }

  guardar(model: Usuario){
    let urls = `${this.url}/PostSaveUsuario`;
    return this.http.post<Response>(urls, model);
  }

  obtener(id: number){
    let urls = `${this.url}/GetFirstUsuario?id=${id}`;
    return this.http.get<Usuario>(urls);
  }

  obtenerPersona(tipodoc:string, documento: string){
    let urls = `${this.url}/GetFirstPersona?tipodoc=${tipodoc}&id=${documento}&`;
    return this.http.get<Usuario>(urls);
  }
}
