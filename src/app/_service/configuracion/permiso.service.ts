import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilResponse } from 'src/app/_model/configuracion/perfil';
import { environment } from 'src/environments/environment';
import { Response } from '../../_model/response';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  private url: string = `${environment.UrlApi}/permiso`;
  
  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

  listar(id: number){
    let urls = `${this.url}/GetAllPermiso?id=${id}`;

    return this.http.get<PerfilResponse>(urls);
  }

  guardar(model: PerfilResponse){
    let urls = `${this.url}/PostSavePermiso`;
    return this.http.post<Response>(urls, model);
  }

}
