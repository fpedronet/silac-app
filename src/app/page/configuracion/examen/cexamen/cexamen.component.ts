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
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import numeral from 'numeral';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';


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

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  selEquicRpta: TbMaestra[] = [];

  @ViewChild(MatStepper)
  stepper!: MatStepper;

  chipsResuNominal: MatChipList[] = [];
  
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
    /*var observer = new MutationObserver(function(mutations_list) {
      mutations_list.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(added_node: any) {
          if(added_node.id == 'rangoCriterio') {
            console.log('#child has been added');
            observer.disconnect();
          }
        });
      });
    });*/
    /*(function(mutations) {
      const $lastAge: any = Array.from(
        document.querySelectorAll('.lastRowAge')
      ).pop();
      
      $lastAge?.focus();
      $lastAge?.select();
   });*/

   //observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

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
    examen.listaEquivalencias?.push(new EquivResultado(this.tbEquivRpta, true));
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

    //Filtrar criterios de equivalencias de la respuesta según su tipo
    this.selEquicRpta = this.tbEquivRpta.filter(e => e.vAux1 === examen.vTipoRespuesta);

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

    model.listaEquivalencias = this.examen.listaEquivalencias?.slice(0, this.examen.listaEquivalencias.length-1);

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
          this.selEquicRpta = this.tbEquivRpta.filter(e => e.vAux2 === '1' && e.vAux1 === this.getControlLabel('vTipoRespuesta'));
        else
          this.selEquicRpta = this.tbEquivRpta.filter(e => e.vAux1 === this.getControlLabel('vTipoRespuesta'));
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
    this.obtieneResultado(codigo, resultados)!.nMinVal = $event.target.value
  }

  agregarFila(){
    var lista = this.examen.listaEquivalencias!;
    var ultimo: EquivResultado = lista[lista.length - 1]
    //Si se validó y guardó el registro anterior
    if(this.setEdicionEquivResu(ultimo, false)){
      var nuevo: EquivResultado = new EquivResultado(this.tbEquivRpta);

      //Copia lista de valores de resultados anteriores
      nuevo.listaRangos! = JSON.parse(JSON.stringify(ultimo.listaRangos!.slice()));

      //Continúa numeración anterior de edades      
      nuevo.nResuNumMin = parseInt(ultimo.nResuNumMax!.toString()) + 1;
      nuevo.nResuNumMax = nuevo.nResuNumMin + (ultimo.nResuNumMax! - ultimo.nResuNumMin!);

      lista?.push(nuevo);
    }
  }  
  
  eliminarFila(){
    var lista = this.examen.listaEquivalencias!;
    lista?.pop();

    //Agrega equivalencia vacía
    if(lista.length === 0) lista?.push(new EquivResultado(this.tbEquivRpta));

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
      return 'Error en el rango de edades.'

    var rangoError = equiv.listaRangos?.find(e => parseFloat(e.nMinVal!.toString()) >= parseFloat(e.nMaxVal!.toString()))
    if(rangoError !== undefined)
      return 'Existe un rango de valores incorrecto.'

    return '';
  }

  obtieneLimites(codigo: string = '', resultados: RangoResu[] = []){
    var formato = this.getControlLabel('vFormato');
    var rangos: string = '';
    var min, max;
    var resu = this.obtieneResultado(codigo, resultados);
    if(resu !== undefined){
      min = numeral(resu.nMinVal);
      max = numeral(resu.nMaxVal);
      rangos = '≥ ' + min.format(formato) + ' < ' + max.format(formato);
    }
    return rangos;
  }

  obtieneResultado(codigo: string = '', resultados: RangoResu[] = [], offset: number = 0){
    var resu = undefined;
    var indice: number;
    var newCodigo: string;
    //Equivalencia actual según el código
    var current = this.tbEquivRpta.find(e => e.vValor === codigo);
    if(current !== undefined){
      //Busca equivalencia correcta desplazandose según indice
      indice = this.tbEquivRpta.indexOf(current) + offset;
      if(indice >= 0 && indice < resultados.length){
        newCodigo = this.tbEquivRpta[indice].vValor!;
        //Resultado obtenido usando a la tbala maestra de equivalencias como guía
        resu = resultados.find(e => e.vEtiqueta === newCodigo);
      }
    }
    return resu;
  }

  cantidadRangos(){
    return this.examen.listaEquivalencias?.filter(e => e.swt === 1).length;
  }

  actualizaVecino(codigo: string = '', resultados: RangoResu[] = [], tipo: string, target?: any){
    var anteResu = this.obtieneResultado(codigo, resultados, -1);
    var sgteResu = this.obtieneResultado(codigo, resultados, 1);

    switch(tipo){
      case 'min':
        if(anteResu !== undefined)
          anteResu.nMaxVal = target.value;
        break;
      case 'max':
        if(sgteResu !== undefined)
          sgteResu.nMinVal = target.value;
        break;
    }
  }

  cambiaTipoRpta(codTipRpta: string){
    this.selEquicRpta = this.tbEquivRpta.filter(e => e.vAux1 === codTipRpta);
  }

  addListResuNominal(event: MatChipInputEvent, listResuNominal: string[] = []): void {
    const value = (event.value || '').trim();

    if (value) {
      listResuNominal.push(value);
    }

    event.chipInput!.clear();
  }

  removeListResuNominal(resu: string, listResuNominal: string[] = []): void {
    const index = listResuNominal.indexOf(resu);

    if (index >= 0) {
      listResuNominal.splice(index, 1);
    }
  }
}
