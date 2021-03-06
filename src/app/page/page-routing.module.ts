import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../_service/guard.service';

import { HomeComponent } from './home/home.component';

import { Not403Component } from './configuracion/not403/not403.component';

import { LordenComponent } from './orden/lorden/lorden.component';
import { CordenComponent } from './orden/corden/corden.component';

import { CpermisoComponent } from './configuracion/permiso/cpermiso/cpermiso.component';
import { LexamenComponent } from './configuracion/lexamen/lexamen.component';

import { LusuarioComponent } from './configuracion/usuario/lusuario/lusuario.component';
import { CusuarioComponent } from './configuracion/usuario/cusuario/cusuario.component';
import { LperfilexamenComponent } from './configuracion/perfil/lperfilexamen/lperfilexamen.component';


const routes: Routes = [
  {path:'home', component: HomeComponent},

  {path: 'not-403', component: Not403Component},

  /********* Como ejemplo *******/

  {path:'laboratorio/ordenes', component: LordenComponent, canActivate: [GuardService]},
  {path:'laboratorio/ordenes/create', component: CordenComponent, canActivate: [GuardService]},

  {path:'configuracion/examenes', component: LexamenComponent, canActivate: [GuardService]},
  //{path:'configuracion/examenes', component: CordenComponent, canActivate: [GuardService]},
  
  {path:'configuracion/permiso', component: CpermisoComponent, canActivate: [GuardService]},

  {path:'configuracion/usuario', component: LusuarioComponent, canActivate: [GuardService]},
  {path:'configuracion/usuario/create', component: CusuarioComponent, canActivate: [GuardService]},
  {path:'configuracion/usuario/edit/:id/:edit', component: CusuarioComponent, canActivate: [GuardService]},

  {path:'configuracion/perfil', component: LperfilexamenComponent, canActivate: [GuardService]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
