import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Examen, PerfilExamen } from 'src/app/_model/configuracion/examen';
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

  listar(search?: string, page?: number,pages?: number, column?: string, order?: string) {   
    let urls = `${this.url}/GetAllExamen?search=${search}&page=${page}&pages=${pages}&column=${column}&order=${order}`;
    return this.http.get<dataCollection>(urls);
  }

  obtener(id: number){
    let urls = `${this.url}/GetFirstRendicion?id=${id}`;
    return this.http.get<Examen>(urls);
  }

  guardar(model: Examen){
    let urls = `${this.url}/PostSaveExamen`;
    return this.http.post<Response>(urls, model);
  }

  listarPerfil(search?: string, page?: number,pages?: number, column?: string, order?: string) {   
    let urls = `${this.url}/GetAllPerfilExamen?search=${search}&page=${page}&pages=${pages}&column=${column}&order=${order}`;
    return this.http.get<dataCollection>(urls);
  }

  guardarPerfil(model: PerfilExamen){
    let urls = `${this.url}/PostSavePerfilExamen`;
    return this.http.post<Response>(urls, model);
  }

  obtenerPerfil(id: number){
    let urls = `${this.url}/GetFirstPerfilExamen?id=${id}`;
    return this.http.get<PerfilExamen>(urls);
  }

}
