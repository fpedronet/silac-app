import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TbMaestra } from 'src/app/_model/combobox';
import { Examen } from 'src/app/_model/configuracion/examen';
import { ExamenService } from 'src/app/_service/configuracion/examen.service';
import { TbmaestraService } from 'src/app/_service/tbmaestra.service';
import { environment } from 'src/environments/environment';
import { ConfimService } from '../../component/confirm/confim.service';
import { NotifierService } from '../../component/notifier/notifier.service';
import { SpinnerService } from '../../component/spinner/spinner.service';

@Component({
  selector: 'app-cexamen',
  templateUrl: './cexamen.component.html',
  styleUrls: ['./cexamen.component.css']
})
export class CexamenComponent implements OnInit {
  
  constructor(
    private dialogRef: MatDialogRef<CexamenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner : SpinnerService,
    private examenService : ExamenService,
    private tbmaestraService: TbmaestraService,
    private notifierService : NotifierService,
    private confirmService : ConfimService,
  )
  {
    if(this.data.curExamen !== undefined)
      this.examen = this.data.curExamen;
    else
      this.examen.nIdExamen = 0;

    if(this.data.edit !== undefined)
      this.edit = this.data.edit;
  }

  form: FormGroup = new FormGroup({});
  loading = true;

  tablasMaestras = ['AREA'];
  tbArea: TbMaestra[] = [];
  /*carBuscaAuto: number = 1;
  nroMuestraAuto: number = 0;

  tbSede: Combobox[] = [];  
  sedeColor: string = 'warn';
  filterSedes: Observable<Combobox[]> | undefined;
  controlSedes = new FormControl();
  ideSede: number = 0;*/

  examen: Examen = new Examen();
  edit: boolean = false;

  ngOnInit(): void {
    this.inicializar();
    this.listarCombo();
  }

  inicializar(){
    //debugger;
    var examen = new Examen();

    this.form = new FormGroup({
      'nIdExamen': new FormControl({ value: examen.nIdExamen, disabled: false}),
      'vCodExamen': new FormControl({ value: examen.vCodExamen, disabled: this.edit}),
      'vDescripcion': new FormControl({ value: examen.vDescripcion, disabled: this.edit})
    });
  }

  obtener(examen: Examen){
    if(examen.nIdExamen === 0){
      
      /*let filtro = this.usuarioService.sessionDetalle();
      if(filtro!=null){
        rendDet.comodato = filtro[0];
        rendDet.ideSede = filtro[1] === '' ? 0 : parseInt(filtro[1]);
        rendDet.nCodLinea = filtro[2];
        rendDet.codMoneda = filtro[3];
      }*/
    }

    this.form.patchValue({
      nIdExamen: examen.nIdExamen,
      vCodExamen: examen.vCodExamen,
      vDescripcion: examen.vDescripcion
      //monto: rendDet.monto === 0?'0.00':rendDet.monto?.toFixed(2),
    });

    /*var sedeFind = this.tbSede.find(e => e.valor === rendDet.ideSede?.toString()); //Ruc
    if(sedeFind !== undefined){
      var sede: Combobox = sedeFind;      
      this.setCurSede(sede);
    }*/
  }

  listarCombo(){
    this.spinner.showLoading();
    
    this.tbmaestraService.cargarDatos(this.tablasMaestras).subscribe(data=>{
      if(data === undefined){
        this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        if(data.items === null){
          this.notifierService.showNotification(0,'Mensaje','No se ha encontrado información');
        }
        else{
          var tbCombobox: TbMaestra[] = data.items;
        
          this.tbArea = this.obtenerSubtabla(tbCombobox,'AREA');
        }          
      }
      this.spinner.hideLoading();
    });
  }

  /*initFilterSedes(reiniciaCmd: boolean = false){
    this.filterSedes = this.controlSedes.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string'?value:value.descripcion)),
      map(name  => (name?this.buscarSedes(name):[]))
    );
    if(reiniciaCmd)
      this.initFilterLineas();
  }*/

  obtenerSubtabla(tb: TbMaestra[], cod: string){
    return tb.filter(e => e.vEtiqueta?.toString()?.trim() === cod);
  }

  /*buscarSedes(name: string): Combobox[]{
    this.setCurSede(undefined, true);
    var results: Combobox[] = [];
    //debugger;
    if(name.length >= this.carBuscaAuto){
      var filtro = name.toLowerCase();
      results = this.tbSede.filter(e => e.descripcion?.toLowerCase().includes(filtro));
    }    
    return results.slice(0,this.nroMuestraAuto===0?results.length:this.nroMuestraAuto);
  }*/

  limpiar(){
    var examen: Examen = new Examen();

    /*let filtro = this.usuarioService.sessionDetalle();
    if(filtro!=null){
      rendDet.comodato = filtro[0];
      rendDet.ideSede = filtro[1] === '' ? 0 : parseInt(filtro[1]);
      rendDet.nCodLinea = filtro[2];
      rendDet.codMoneda = filtro[3];
    }*/

    this.form.patchValue({
      nIdExamen: examen.nIdExamen,
      vCodExamen: examen.vCodExamen,
      vDescripcion: examen.vDescripcion
      //monto: '0.00'
    })
    
    //this.setCurSede(undefined);
  }

  guardar(){
    let model = new Examen();
    
    model.nIdExamen = this.form.value['nIdExamen'];
    model.vCodExamen = this.form.value['vCodExamen'];
    model.vDescripcion = this.form.value['vDescripcion'];

    //model.ideSede = this.ideSede;

    //var nMonto = Number(this.form.value['monto']);
    //model.monto = isNaN(nMonto)?0:nMonto;

    this.spinner.showLoading();

    this.examenService.guardar(model).subscribe(data=>{
      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);

      if(data.typeResponse==environment.EXITO){      
        this.spinner.hideLoading();

        //Guarda caché de valores ingresados
        /*localStorage.setItem(environment.CODIGO_DETALLE, 
          (model.comodato === undefined ? '' : model.comodato) + "|" +
          (model.ideSede === undefined ? '' : model.ideSede?.toString()) + "|" +
          (model.codLinea === undefined ? '' : model.codLinea) + "|" +
          (model.codMoneda === undefined ? '' : model.codMoneda)
        );*/
        
        this.dialogRef.close();
      }else{
        this.spinner.hideLoading();
      }
    });    
    
  }

  closeModal(){
    if(this.camposCambiados(this.examen)){
      this.confirmService.openConfirmDialog(false, "Tiene cambios sin guardar, ¿Desea salir?").afterClosed().subscribe(res =>{
        //Ok
        if(res){
          //console.log('Sí');
          this.$closeModal();
        }
      });
    }
    else{
      this.$closeModal();
    }    
  }

  $closeModal(){
    this.dialogRef.close();
  }

  getControlLabel(type: string){
    return this.form.controls[type].value;
  }

  camposCambiados(examen: Examen){

    var codExamen: boolean = examen.vCodExamen !== this.getControlLabel('vCodExamen');
    var descripcion: boolean = examen.vDescripcion !== this.getControlLabel('vDescripcion');

    return codExamen || descripcion;
  }
}
