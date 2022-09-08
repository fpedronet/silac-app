import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { TbMaestra } from 'src/app/_model/combobox';
import { EquivResultado, Examen, RangoResu } from 'src/app/_model/configuracion/examen';
import { ExamenService } from 'src/app/_service/configuracion/examen.service';
import { TbmaestraService } from 'src/app/_service/tbmaestra.service';
import { environment } from 'src/environments/environment';
import numeral from 'numeral';


@Component({
  selector: 'app-cexamen',
  templateUrl: './cexamen.component.html',
  styleUrls: ['./cexamen.component.css'],
  encapsulation : ViewEncapsulation.None,
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

  currentTab: number = 0;

  tablasMaestras = ['AREXA', 'TMUE', 'SGRPO', 'RPTA', 'EQRTA', 'SEXO'];
  tbArea: TbMaestra[] = [];
  tbMuestra: TbMaestra[] = [];
  tbGrupo: TbMaestra[] = [];
  tbRpta: TbMaestra[] = [];
  tbEquivRpta: TbMaestra[] = [];
  tbSexo: TbMaestra[] = [];

  incluirExtremos: boolean = true;
  invierteColores: boolean = false;
  incluirMensaje: boolean = false;

  selEquicRpta: TbMaestra[] = [];

  @ViewChild(MatStepper)
  stepper!: MatStepper;
  
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

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  inicializar(){
    
    numeral.defaultFormat('0');

    var examen = new Examen();

    this.form = new FormGroup({
      'nIdExamen': new FormControl({ value: examen.nIdExamen, disabled: false}),
      'vCodExamen': new FormControl({ value: examen.vCodExamen, disabled: !this.edit}),
      'vDescripcion': new FormControl({ value: examen.vDescripcion, disabled: !this.edit}),
      'vCodAreaExamen': new FormControl({ value: examen.vCodAreaExamen, disabled: !this.edit}),
      'vCodTipoMuestra': new FormControl({ value: examen.vCodTipoMuestra, disabled: !this.edit}),
      'vFormula': new FormControl({ value: examen.vFormula, disabled: !this.edit}),
      'vFormato': new FormControl({ value: examen.vFormato, disabled: !this.edit}),      

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

    //debugger;

    this.form.patchValue({
      nIdExamen: examen.nIdExamen,
      vCodExamen: examen.vCodExamen,
      vDescripcion: examen.vDescripcion,
      vCodAreaExamen: examen.vCodAreaExamen,
      vCodTipoMuestra: examen.vCodTipoMuestra,
      vFormula: examen.vFormula,
      vFormato: examen.vFormato,

      vAbreviatura: examen.vAbreviatura,
      vUndMed: examen.vUndMed,
      vRangoRef: examen.vRangoRef,
      vCodSubGrupo: examen.vCodSubGrupo,
      vTipoRespuesta: examen.vTipoRespuesta,
      vRespuesta: examen.vRespuesta
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
          this.tbEquivRpta = this.obtenerSubtabla(tbCombobox,'EQRTA');
          this.tbSexo = this.obtenerSubtabla(data.items,'SEXO');

          this.selEquicRpta = this.tbEquivRpta.slice();

          this.obtener(this.examen);
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
    return tb.filter(e => e.vCodTabla?.toString()?.trim() === cod);
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

    if(this.examen.nIdExamen === 0)
      this.form.patchValue({
        vCodExamen: examen.vCodExamen,
        vDescripcion: examen.vDescripcion
      });

    this.form.patchValue({
      vCodAreaExamen: examen.vCodAreaExamen,
      vCodTipoMuestra: examen.vCodTipoMuestra,
      vFormula: examen.vFormula,
      vFormato: examen.vFormato,      

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
    model.vFormula = this.form.value['vFormula'];
    model.vFormato = this.form.value['vFormato'];    
    model.vAbreviatura = this.form.value['vAbreviatura'];
    model.vUndMed = this.form.value['vUndMed'];
    model.vRangoRef = this.form.value['vRangoRef'];
    model.vCodSubGrupo = this.form.value['vCodSubGrupo'];
    model.vTipoRespuesta = this.form.value['vTipoRespuesta'];
    model.vRespuesta = this.form.value['vRespuesta'];

    model.listaEquivalencias = this.examen.listaEquivalencias;

    //model.ideSede = this.ideSede;

    //var nMonto = Number(this.form.value['monto']);
    //model.monto = isNaN(nMonto)?0:nMonto;

    this.spinner.showLoading();

    this.examenService.guardar(model).subscribe(data=>{
      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);

      if(data.typeResponse==environment.EXITO){
        this.form.patchValue({
          nIdExamen: data.ide
        });

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
    //debugger;

    var codExamen: boolean = examen.vCodExamen !== this.getControlLabel('vCodExamen');
    var descripcion: boolean = examen.vDescripcion !== this.getControlLabel('vDescripcion');
    var area: boolean = examen.vCodAreaExamen !== this.getControlLabel('vCodAreaExamen');
    var muestra: boolean = examen.vCodTipoMuestra !== this.getControlLabel('vCodTipoMuestra');
    var formula: boolean = examen.vFormula !== this.getControlLabel('vFormula');
    var formato: boolean = examen.vFormato !== this.getControlLabel('vFormato');
    var abreviatura: boolean = examen.vAbreviatura !== this.getControlLabel('vAbreviatura');
    var unidad: boolean = examen.vUndMed !== this.getControlLabel('vUndMed');
    var rango: boolean = examen.vRangoRef !== this.getControlLabel('vRangoRef');
    var grupo: boolean = examen.vCodSubGrupo !== this.getControlLabel('vCodSubGrupo');
    var tiporpta: boolean = examen.vTipoRespuesta !== this.getControlLabel('vTipoRespuesta');
    var respuesta: boolean = examen.vRespuesta !== this.getControlLabel('vRespuesta');

    return codExamen || descripcion || area || muestra || formato || formula || abreviatura || unidad || rango || grupo || tiporpta || respuesta;
  }

  changestepper(stepper: any, numTab: number = -1){
    if(numTab === -1)
      this.currentTab = stepper._selectedIndex;
    else
      this.currentTab = numTab;
  }

  actualizaCheckbox(condicion: number, checked: boolean){
    switch (condicion){
      case 1:
        this.incluirExtremos = checked;
        if(!checked)
          this.selEquicRpta = this.tbEquivRpta.filter(e => e.vAux1 === '1');
        else
          this.selEquicRpta = this.tbEquivRpta.slice();
        break;
      case 2:
        this.invierteColores = checked;
        break;
      case 3:
        this.incluirMensaje = checked;
        break;
    }
  }

  cambiaRangoResu(codigo: string = '', resultados: RangoResu[] = [], $event: any){
    this.obtieneResultado(codigo, resultados)!.nValMin = $event.target.value
  }

  agregarFila(){
    var lista = this.examen.listaEquivalencias!;
    var ultimo: EquivResultado = lista[lista.length - 1]
    if(this.setEdicionEquivResu(ultimo, false)){
      //Continúa numeración anterior
      var nuevo: EquivResultado = new EquivResultado();
      nuevo.nResuNumMin = parseInt(ultimo.nResuNumMax!.toString()) + 1;
      nuevo.nResuNumMax = nuevo.nResuNumMin + (ultimo.nResuNumMax! - ultimo.nResuNumMin!)
      lista?.push(nuevo);
    }
  }  
  
  eliminarFila(){
    var lista = this.examen.listaEquivalencias!;
    lista?.pop();

    //Agrega equivalencia vacía
    if(lista.length === 0) lista?.push(new EquivResultado());
    
    var ultimo: EquivResultado = lista[lista.length - 1]
    this.setEdicionEquivResu(ultimo, true);
  }

  setEdicionEquivResu(equiv: EquivResultado, estado: boolean){
    var msgError = this.rangoValido(equiv);
    if(msgError !== ''){
      this.notifierService.showNotification(2,'Mensaje',msgError);
      return false;
    }
    equiv.edicion = estado;
    if(!estado) equiv.swt = 1;
    return true;
  }

  rangoValido(equiv: EquivResultado){
    if(equiv.nResuNumMax! < equiv.nResuNumMin!)
      return 'El valor máximo no debe ser menor al mínimo.'

    return '';
  }

  obtieneLimites(codigo: string = '', resultados: RangoResu[] = []){
    var formato = this.getControlLabel('vFormato');
    var rangos: string = '';
    var min, max;
    var resu = this.obtieneResultado(codigo, resultados);
    if(resu !== undefined){
      min = numeral(resu.nValMin);
      max = numeral(resu.nValMax);
      rangos = '≥ ' + min.format(formato) + ' < ' + max.format(formato);
    }
    return rangos;
  }

  obtieneResultado(codigo: string = '', resultados: RangoResu[] = []){
    return resultados.find(e => e.vEtiqueta === codigo);
  }
}
