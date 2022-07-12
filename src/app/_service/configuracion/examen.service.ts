import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Examen } from 'src/app/_model/configuracion/examen';
import { dataCollection } from 'src/app/_model/dataCollection';
import { environment } from 'src/environments/environment';
import { Response } from 'src/app/_model/response';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = `${environment.UrlApi}/examen`;

  /*listar(codigo: string, idePantalla: number, ideUsuario: number, lstEstados: number[], fechaIni?: Date, fechaFin?: Date, tipo?: string, page?: number,pages?: number) {   
    let urls = `${this.url}/GetAllRendicionM`;
    return this.http.post<dataCollection>(urls);
  }*/

  obtener(id: number){
    let urls = `${this.url}/GetFirstRendicion?id=${id}`;

    return this.http.get<Examen>(urls);
  }

  guardar(model: Examen){
    let urls = `${this.url}/PostSaveExamen`;
    return this.http.post<Response>(urls, model);
  }
}
