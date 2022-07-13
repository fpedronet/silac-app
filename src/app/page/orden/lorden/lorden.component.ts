import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';

import { Orden, OrdenRequest } from 'src/app/_model/laboratorio/orden';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { NotifierService } from '../../component/notifier/notifier.service';
import { OrdenService } from 'src/app/_service/laboratorio/orden.service';


@Component({
  selector: 'app-lorden',
  templateUrl: './lorden.component.html',
  styleUrls: ['./lorden.component.css']
})
export class LordenComponent implements OnInit {

  dataSource: Orden[] = [];
  displayedColumns: string[] = ['codigo','natencion', 'fecha', 'documento', 'nombre', 'sexo', 'edad'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,    
    private notifierService : NotifierService,
    private ordenService: OrdenService,
  ) { }

  ngOnInit(): void {
  }

  
  ngAfterViewInit() {
    let req = new OrdenRequest();

    this.ordenService = new OrdenService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
 
    req.page = this.paginator.pageIndex;
    req.pages =  this.paginator.pageSize;
    req.column = (this.sort.active == undefined)? '' : this.sort.active
    req.order = this.sort.direction

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.ordenService!.listar(
            req
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(res => {

           this.loading = false;
           this.existRegistro = res === null;

          if (res === null) {
            return [];
          }

          this.countRegistro = res.pagination.total;
          return res.items;
        }),
      ).subscribe(data => (this.dataSource = data));
      
  }

}
