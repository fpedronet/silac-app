import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  listar() {
    let req = new OrdenRequest{};
   
    let urls = `${this.url}/GetAllOrden`;
    return this.http.post<dataCollection>(urls,req);
  }
  
}
