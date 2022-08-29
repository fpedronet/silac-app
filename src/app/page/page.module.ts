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
import { Not404Component } from './configuracion/not404/not404.component';
import { Not403Component } from './configuracion/not403/not403.component';
import { CordenComponent } from './orden/corden/corden.component';
import { LordenComponent } from './orden/lorden/lorden.component';
import { CpermisoComponent } from './configuracion/permiso/cpermiso/cpermiso.component';
import { CexamenComponent } from './configuracion/cexamen/cexamen.component';
import { LexamenComponent } from './configuracion/lexamen/lexamen.component';
import { LusuarioComponent } from './configuracion/usuario/lusuario/lusuario.component';
import { CusuarioComponent } from './configuracion/usuario/cusuario/cusuario.component';
import { LperfilexamenComponent } from './configuracion/perfil/lperfilexamen/lperfilexamen.component';
import { FusuaioComponent } from './configuracion/usuario/fusuaio/fusuaio.component';
import { CinterfaceComponent } from './configuracion/interface/cinterface/cinterface.component';
import { LinterfaceComponent } from './configuracion/interface/linterface/linterface.component';
import { FinterfaceComponent } from './configuracion/interface/finterface/finterface.component';

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
