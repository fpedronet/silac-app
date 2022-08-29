import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { dataCollection } from 'src/app/_model/dataCollection';
import { OrdenRequest } from 'src/app/_model/laboratorio/orden';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = `${environment.UrlApi}/orden`;

  listar(documento: string, data: string, estado: string, page: number,pages: number, column: string, order: SortDirection) {
  
    let urls = `${this.url}/GetAllOrden`;
    let req = new OrdenRequest();
    // req.documento = documento;
    // req.data = data;
    // req.estado = (estado=="2")? "" : estado;
    req.page = page;
    req.pages =  pages;
    req.column = (column==undefined)?'':column;
    req.order = order;

    return this.http.post<dataCollection>(urls,req);
  }

  
}
