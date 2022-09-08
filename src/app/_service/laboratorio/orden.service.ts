import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { dataCollection } from 'src/app/_model/dataCollection';
import { Orden, OrdenRequest } from 'src/app/_model/laboratorio/orden';
import { environment } from 'src/environments/environment';
import { Response } from '../../_model/response';

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

  guardar(model: Orden){
    let urls = `${this.url}/PostSaveOrden`;
    return this.http.post<Response>(urls, model);
  }

  obtener(idorden: number){
    let urls = `${this.url}/GetFirstOrden?idorden=${idorden}`;
    return this.http.get<Orden>(urls);
  }

  obtenerdetalle(idorden: number){
    let urls = `${this.url}/GetFirstOrdenDetalle?idorden=${idorden}`;
    return this.http.get<Orden>(urls);
  }

  obtenerresultado(idorden: number,idarea: string,idpaciente: number){
    let urls = `${this.url}/GetFirstResultadoExamen?idorden=${idorden}&idarea=${idarea}&&idpaciente=${idpaciente}`;
    return this.http.get<Orden>(urls);
  }

  
}
