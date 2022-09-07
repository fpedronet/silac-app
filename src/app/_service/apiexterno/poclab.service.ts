import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Persona } from 'src/app/_model/persona';
import { Poclab } from 'src/app/_model/poclab';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PoclabService {

  constructor(private http: HttpClient) {} 
  
  private url: string = `https://service.poclab.pe/poclab`;
  private urlP: string = `${environment.UrlApi}/persona`;

  obtenerPersonaReniec(tipoDocu: string, numDocu: string){
    let api = `${this.url}/Persona/BuscarPersona/`;

    var url = api + "0" + tipoDocu + "/" + numDocu + "/" + 0 + "/" + 1;

    var p = this.http.get<Poclab>(url);
    return p;
  }

  obtenerPersonaLocal(tipodoc:string, documento: string){
    let urls = `${this.urlP}/GetFirstPersona?tipodoc=${tipodoc}&id=${documento}&`;
    return this.http.get<Persona>(urls);
  }
}
