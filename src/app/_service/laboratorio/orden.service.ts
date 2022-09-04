import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { dataCollection } from 'src/app/_model/dataCollection';
import { Orden, OrdenRequest } from 'src/app/_model/laboratorio/orden';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = `${environment.UrlApi}/orden`;

  listar(nombre: string, tipo: string, area: string, origen: string, fechaIni: Date, fechaFin: Date, page: number,pages: number, column: string, order: SortDirection) {
    let urls = `${this.url}/GetAllOrden`;
    let req = new OrdenRequest();
    req.nombre = nombre;
    req.tipo = tipo;
    req.area = area;
    req.origen = origen;
    req.fechaIni = (fechaIni==undefined)? '' : fechaIni.toISOString().split('T')[0];
    req.fechaFin = (fechaFin==undefined)? '' : fechaFin.toISOString().split('T')[0];
    req.page = page;
    req.pages =  pages;
    req.column = (column==undefined)?'':column;
    req.order = order;

    return this.http.post<dataCollection>(urls,req);
  }

  obtenerdetalle(idorden: number,idpaciente: number){
    let urls = `${this.url}/GetFirstDetalleOrden?idorden=${idorden}&idpaciente=${idpaciente}`;
    return this.http.get<Orden>(urls);
  }

  
}
