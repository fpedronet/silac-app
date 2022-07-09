import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../_service/guard.service';

import { HomeComponent } from './home/home.component';

import { Not403Component } from './configuracion/not403/not403.component';

import { LordenComponent } from './orden/lorden/lorden.component';
import { CordenComponent } from './orden/corden/corden.component';

import { CpermisoComponent } from './configuracion/permiso/cpermiso/cpermiso.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},

  {path: 'not-403', component: Not403Component},

  /********* Como ejemplo *******/

  {path:'laboratorio/ordenes', component: LordenComponent, canActivate: [GuardService]},
  {path:'laboratorio/ordenes/create', component: CordenComponent, canActivate: [GuardService]},
  
  {path:'configuracion/permiso', component: CpermisoComponent, canActivate: [GuardService]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
