import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TbMaestra } from '../_model/combobox';

@Injectable({
  providedIn: 'root'
})
export class TbmaestraService {

  private url: string = `${environment.UrlApi}/tablamaestra`;
  static http: any;

  constructor(private http: HttpClient) { }

  public cargarDatos(etiquetas: string[]){

    let href = `${this.url}/GetAllTablaMaestra`;
    let urls = `${href}?Etiquetas=${etiquetas.join('|')}`;
    return this.http.get<TbMaestra>(urls);
  }
}
