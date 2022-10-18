import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ConfirmComponent } from './component/confirm/confirm.component';
import { LayoutComponent } from './component/layout/layout.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PageRoutingModule } from './page-routing.module';
import { InterceptorService } from '../_interceptors/interceptor.service';
import { Not404Component } from './component/not404/not404.component';
import { Not403Component } from './component/not403/not403.component';
import { CpermisoComponent } from './configuracion/permiso/cpermiso/cpermiso.component';
import { CexamenComponent } from './configuracion/examen/cexamen/cexamen.component';
import { LexamenComponent } from './configuracion/examen/lexamen/lexamen.component';
import { LusuarioComponent } from './configuracion/usuario/lusuario/lusuario.component';
import { CusuarioComponent } from './configuracion/usuario/cusuario/cusuario.component';
import { LperfilexamenComponent } from './configuracion/perfil/lperfilexamen/lperfilexamen.component';
import { FusuaioComponent } from './configuracion/usuario/fusuaio/fusuaio.component';
import { CinterfaceComponent } from './configuracion/interface/cinterface/cinterface.component';
import { LinterfaceComponent } from './configuracion/interface/linterface/linterface.component';
import { FinterfaceComponent } from './configuracion/interface/finterface/finterface.component';
import { CordenComponent } from './laboratorio/orden/corden/corden.component';
import { LordenComponent } from './laboratorio/orden/lorden/lorden.component';
import { FordenComponent } from './laboratorio/orden/forden/forden.component';
import { DordenComponent } from './laboratorio/orden/dorden/dorden.component';

@NgModule({
  declarations: [
    ConfirmComponent,
    LayoutComponent,
    HomeComponent,
    Not404Component,
    Not403Component,
    CordenComponent,
    LordenComponent,
    CpermisoComponent,
    CexamenComponent,
    LexamenComponent,
    LusuarioComponent,
    CusuarioComponent,
    LperfilexamenComponent,
    FusuaioComponent,
    CinterfaceComponent,
    LinterfaceComponent,
    FinterfaceComponent,
    FordenComponent,
    DordenComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PageRoutingModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true,
  },
  {
    provide:LocationStrategy,
    useClass:HashLocationStrategy
  }
],
})

export class PageModule { }
