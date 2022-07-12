import { Component, OnInit } from '@angular/core';
import { Orden } from 'src/app/_model/laboratorio/orden';

@Component({
  selector: 'app-lorden',
  templateUrl: './lorden.component.html',
  styleUrls: ['./lorden.component.css']
})
export class LordenComponent implements OnInit {

  dataSource: Orden[] = [];
  displayedColumns: string[] = ['select','codigo1', 'codigo', 'tipo', 'lugar', 'motivo', 'balance','estado','correo','accion','mo'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
