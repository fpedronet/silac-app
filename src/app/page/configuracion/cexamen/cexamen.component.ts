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

  tablasMaestras = ['AREXA', 'TMUE', 'SGRPO', 'RPTA'];
  tbArea: TbMaestra[] = [];
  tbMuestra: TbMaestra[] = [];
  tbGrupo: TbMaestra[] = [];
  tbRpta: TbMaestra[] = [];
  /*carBuscaAuto: number = 1;
  nroMuestraAuto: number = 0;

  tbSede: Combobox[] = [];  
  sedeColor: string = 'warn';
  filterSedes: Observable<Combobox[]> | undefined;
  controlSedes = new FormControl();
  ideSede: number = 0;*/

  examen: Examen = new Examen();
  edit: boolean = true;

  ngOnInit(): void {
    this.inicializar();
    this.listarCombo();
  }

  inicializar(){
    //debugger;
    var examen = new Examen();

    this.form = new FormGroup({
      'nIdExamen': new FormControl({ value: examen.nIdExamen, disabled: false}),
      'vCodExamen': new FormControl({ value: examen.vCodExamen, disabled: !this.edit}),
      'vDescripcion': new FormControl({ value: examen.vDescripcion, disabled: !this.edit}),
      'vCodAreaExamen': new FormControl({ value: examen.vCodAreaExamen, disabled: !this.edit}),
      'vCodTipoMuestra': new FormControl({ value: examen.vCodTipoMuestra, disabled: !this.edit}),
      'vFormato': new FormControl({ value: examen.vFormato, disabled: !this.edit}),
      'vFormula': new FormControl({ value: examen.vFormula, disabled: !this.edit}),

      'vAbreviatura': new FormControl({ value: examen.vAbreviatura, disabled: !this.edit}),
      'vUndMed': new FormControl({ value: examen.vUndMed, disabled: !this.edit}),
      'vRangoRef': new FormControl({ value: examen.vRangoRef, disabled: !this.edit}),
      'vCodSubGrupo': new FormControl({ value: examen.vCodSubGrupo, disabled: !this.edit}),
      'vTipoRespuesta': new FormControl({ value: examen.vTipoRespuesta, disabled: !this.edit}),
      'vRespuesta': new FormControl({ value: examen.vRespuesta, disabled: !this.edit})
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
        
          this.tbArea = this.obtenerSubtabla(tbCombobox,'AREXA');
          this.tbMuestra = this.obtenerSubtabla(tbCombobox,'TMUE');
          this.tbGrupo = this.obtenerSubtabla(tbCombobox,'SGRPO');
          this.tbRpta = this.obtenerSubtabla(tbCombobox,'RPTA');
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
      vCodExamen: examen.vCodExamen,
      vDescripcion: examen.vDescripcion,
      vCodAreaExamen: examen.vCodAreaExamen,
      vCodTipoMuestra: examen.vCodTipoMuestra,
      vFormato: examen.vFormato,
      vFormula: examen.vFormula,

      vAbreviatura: examen.vAbreviatura,
      vUndMed: examen.vUndMed,
      vRangoRef: examen.vRangoRef,
      vCodSubGrupo: examen.vCodSubGrupo,
      vTipoRespuesta: examen.vTipoRespuesta,
      vRespuesta: examen.vRespuesta
    })
    
    //this.setCurSede(undefined);
  }

  guardar(){
    let model = new Examen();
    
    model.nIdExamen = this.form.value['nIdExamen'];
    model.vCodExamen = this.form.value['vCodExamen'];
    model.vDescripcion = this.form.value['vDescripcion'];
    model.vCodAreaExamen = this.form.value['vCodAreaExamen'];
    model.vCodTipoMuestra = this.form.value['vCodTipoMuestra'];
    model.vFormato = this.form.value['vFormato'];
    model.vFormula = this.form.value['vFormula'];
    model.vAbreviatura = this.form.value['vAbreviatura'];
    model.vUndMed = this.form.value['vUndMed'];
    model.vRangoRef = this.form.value['vRangoRef'];
    model.vCodSubGrupo = this.form.value['vCodSubGrupo'];
    model.vTipoRespuesta = this.form.value['vTipoRespuesta'];
    model.vRespuesta = this.form.value['vRespuesta'];

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
    var area: boolean = examen.vCodAreaExamen !== this.getControlLabel('vCodAreaExamen');
    var muestra: boolean = examen.vCodTipoMuestra !== this.getControlLabel('vCodTipoMuestra');
    var formato: boolean = examen.vFormato !== this.getControlLabel('vFormato');
    var formula: boolean = examen.vFormula !== this.getControlLabel('vFormula');
    var abreviatura: boolean = examen.vAbreviatura !== this.getControlLabel('vAbreviatura');
    var unidad: boolean = examen.vUndMed !== this.getControlLabel('vUndMed');
    var rango: boolean = examen.vRangoRef !== this.getControlLabel('vRangoRef');
    var grupo: boolean = examen.vCodSubGrupo !== this.getControlLabel('vCodSubGrupo');
    var tiporpta: boolean = examen.vTipoRespuesta !== this.getControlLabel('vTipoRespuesta');
    var respuesta: boolean = examen.vRespuesta !== this.getControlLabel('vRespuesta');

    return codExamen || descripcion || area || muestra || formato || formula || abreviatura || unidad || rango || grupo || tiporpta || respuesta;
  }
}
