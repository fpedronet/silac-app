import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Interface, InterfaceRequest } from 'src/app/_model/configuracion/interface';
import { dataCollection } from 'src/app/_model/dataCollection';
import { environment } from 'src/environments/environment';
import { Response } from '../../_model/response';

@Injectable({
  providedIn: 'root'
})
export class InterfaceService {

  private url: string = `${environment.UrlApi}/interface`;
  
  constructor(
    private http: HttpClient
    ) { }

  listar(documento: string, data: string, estado: string, page: number,pages: number, column: string, order: SortDirection) {
  
    let urls = `${this.url}/GetAllInterface`;
    let req = new InterfaceRequest();
    req.documento = documento;
    req.data = data;
    req.estado = (estado=="2")? "" : estado;
    req.page = page;
    req.pages =  pages;
    req.column = (column==undefined)?'':column;
    req.order = order;

    return this.http.post<dataCollection>(urls,req);
  }

  guardar(model: Interface){
    let urls = `${this.url}/PostSaveInterface`;
    return this.http.post<Response>(urls, model);
  }

  obtener(id: number){
    let urls = `${this.url}/GetFirstInterface?id=${id}`;
    return this.http.get<Interface>(urls);
  }
}
