import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, startWith, map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

import forms from 'src/assets/json/formulario.json';
import jsonPais from 'src/assets/json/ubigeo/pais.json';
import jsonDepartamento from 'src/assets/json/ubigeo/departamentos.json';
import jsonProvincia from 'src/assets/json/ubigeo/provincias.json';
import jsonDistrito from 'src/assets/json/ubigeo/distritos.json';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';

import { Permiso } from 'src/app/_model/permiso';
import { TbmaestraService } from 'src/app/_service/tbmaestra.service';
import { TbMaestra } from 'src/app/_model/combobox';
import { Perfil } from 'src/app/_model/configuracion/perfil';
import { Usuario } from 'src/app/_model/configuracion/usuario';
import { Distrito, Ubigeo } from 'src/app/_model/distrito';
import { PoclabService } from 'src/app/_service/apiexterno/poclab.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-cusuario',
  templateUrl: './cusuario.component.html',
  styleUrls: ['./cusuario.component.css']
})
export class CusuarioComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};

  id: number = 0;
  edit: boolean = true;
  codEstado: string = "1";
  nombres: string = "";
  documento: string = "";
  currentTab: number = 0;
  peru: string = '01';
  fechaNac: Date | null = null;
  maxDate: Date = new Date();
  minDate: Date = new Date();

  tablasMaestras = ['TDOC', 'SEXO','ESCIV'];
  listaTipoDocumento?: TbMaestra[] = [];
  listaTipoGenero?: TbMaestra[] = [];
  listaEstadoCivil?: TbMaestra[] = [];
  listaPerfil: Perfil[] = [];
  listaPais: Ubigeo[] = jsonPais;

  idTipoDocumento: string = '';
  codDepartamento: string = '';
  codProvincia: string = '';
  codDistrito: string = '';
  controlDistritos = new FormControl();
  filterDistritos: Observable<Distrito[]> | undefined;
  distritos: Distrito[] = [];
  carBuscaDistrito: number = 2;
  nroDistritosMuestra: number = 15;

  muestraDistrito: boolean = false;
  distritoColor: string = 'accent'
  selectedPais: string = '';

  @ViewChild(MatStepper)
  stepper!: MatStepper;
  
  //Webcam
  public foto?: string =environment.UrlImage + "people.png";
  public fotoUrl: string = '';
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string = '';
  public videoOptions: MediaTrackConstraints = {
    width: {ideal: 200},
    height: {ideal: 222}
  };
  public mirrorOptions: string = 'never';
  public errors: WebcamInitError[] = [];
  public webcamImage: WebcamImage | null = null;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  //costructor
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private configPermisoService : ConfigPermisoService,
    private tbmaestraService : TbmaestraService,
    private poclabService: PoclabService
  ) { }

  ngOnInit(): void {

    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    
    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.edit = (data["edit"]==undefined) ? true : ((data["edit"]=='true') ? true : false)      
    });

    this.inicializar();

    this.obtenerpermiso();

    this.listarDistritos(null!, null!, null!);

    this.listarCombo();

    this.minDate.setMonth(this.maxDate.getMonth() - 12*120);  
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  inicializar(){

    this.form = new FormGroup({
      'nIdUsuario': new FormControl({ value: 0, disabled: !this.edit}),
      'nIdPersona': new FormControl({ value: 0, disabled: !this.edit}),
      'vDocumento': new FormControl({ value: '', disabled: !this.edit}),
      'vTipDocu': new FormControl({ value: '', disabled: !this.edit}),
      'vApPaterno': new FormControl({ value: '', disabled: !this.edit}),
      'vApMaterno': new FormControl({ value: '', disabled: !this.edit}),
      'vPrimerNombre': new FormControl({ value: '', disabled: !this.edit}),
      'vSegundoNombre': new FormControl({ value: '', disabled: !this.edit}),
      'vSexo': new FormControl({ value: '', disabled: !this.edit}),
      'nEdad': new FormControl({ value: '', disabled: !this.edit}),
      'dFechaNac': new FormControl({ value: '', disabled: !this.edit}),
      'vEstCivil': new FormControl({ value: '', disabled: !this.edit}),
      'vUsuario': new FormControl({ value: '', disabled: !this.edit}),
      'vContrasena': new FormControl({ value: '', disabled: !this.edit}),
      'vColegiatura': new FormControl({ value: '', disabled: !this.edit}),
      'vCelular': new FormControl({ value: '', disabled: !this.edit}),
      'vTelefono': new FormControl({ value: '', disabled: !this.edit}),
      'vCorreo1': new FormControl({ value: '', disabled: !this.edit}),
      'vCorreo2': new FormControl({ value: '', disabled: !this.edit}),
      'nPeso': new FormControl({ value: '', disabled: !this.edit}),
      'nTalla': new FormControl({ value: '', disabled: !this.edit}),
      'vCodPais': new FormControl({ value: '', disabled: !this.edit}),
      'vCodDepa': new FormControl({ value: '', disabled: !this.edit}),
      'vCodProv': new FormControl({ value: '', disabled: !this.edit}),
      'vCodDist': new FormControl({ value: '', disabled: !this.edit}),
      'vDireccion': new FormControl({ value: '', disabled: !this.edit})
    });
  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.usuario.codigo).subscribe(data=>{
      this.permiso = data;
    });   
  }

  listarCombo(){
    this.spinner.showLoading();
    this.tbmaestraService.cargarDatos(this.tablasMaestras).subscribe(data=>{
      this.listaTipoDocumento = this.obtenerSubtabla(data.items,'TDOC');
      this.listaTipoGenero = this.obtenerSubtabla(data.items,'SEXO');
      this.listaEstadoCivil = this.obtenerSubtabla(data.items,'ESCIV');

      this.idTipoDocumento = this.listaTipoDocumento.length>0? this.listaTipoDocumento[0].vValor! : '';

      this.obtener();
    });
  }

  obtener(){
    this.usuarioService.obtener(this.id).subscribe(data=>{

      data.vTipDocu = (data.vTipDocu==null)?  this.idTipoDocumento: data.vTipDocu;
      data.nPeso = (data.nPeso==0)?  null!: data.nPeso!;
      data.nTalla = (data.nTalla==0)?  null!: data.nTalla!;
      data.vCodPais = (data.vCodPais=='' || data.vCodPais==null)?  this.peru!: data.vCodPais!;

      this.selectedPais = data.vCodPais;
      this.muestraDistrito = true;
      if(this.selectedPais !== this.peru){
        this.codDistrito = '';
        this.distritoColor = 'accent';
        this.muestraDistrito = false;
      }

      this.form.patchValue({
        nIdUsuario: data.nIdUsuario,
        nIdPersona: data.nIdPersona,
        vDocumento: data.vDocumento,
        vTipDocu: data.vTipDocu,
        vApPaterno: data.vApPaterno,
        vApMaterno: data.vApMaterno,
        vPrimerNombre: data.vPrimerNombre,
        vSegundoNombre: data.vSegundoNombre,
        vSexo: data.vSexo,
        nEdad: data.nEdad,
        dFechaNac: data.dFechaNac,
        vEstCivil: data.vEstCivil,
        vUsuario: data.vUsuario,
        vContrasena: data.vContrasena,
        vColegiatura: data.vColegiatura,
        vCelular: data.vCelular,
        vTelefono: data.vTelefono,
        vCorreo1: data.vCorreo1,
        vCorreo2: data.vCorreo2,
        nPeso: data.nPeso,
        nTalla: data.nTalla,
        vCodPais: data.vCodPais,
        vCodDepa: data.vCodDepa,
        vCodProv: data.vCodProv,
        vCodDist: data.vCodDist,
        vDireccion: data.vDireccion
       
      });

        if(data.vCodDepa!=null && data.vCodProv!=null && data.vCodDist!=null){
          let departamento: Ubigeo[] = jsonDepartamento;
          let provincia: Ubigeo[] = jsonProvincia;
          let distrito: Ubigeo[] = jsonDistrito;
  
          departamento = departamento.filter(y=>y.id==data.vCodDepa);
          provincia = provincia.filter(y=>y.id==data.vCodProv);
          distrito = distrito.filter(y=>y.id==data.vCodDist);
  
          this.listarDistritos(departamento, provincia, distrito).then(res => {
          });
           
          this.codDepartamento = data.vCodDepa!;
          this.codProvincia = data.vCodProv!;
          this.codDistrito = data.vCodDist!;

        }  

        this.cambiaPaisDistrito(data.vCodPais, data.vCodDist);

        if(data.nIdPerfil!="" && data.nIdPerfil!=null){
          var listaIdPerfil = data.nIdPerfil!.split("|");

          data.listaPerfil?.forEach(y=>{
            var select = listaIdPerfil.filter(x=>x == y.nIdPerfil?.toString())[0];
    
            if(select!=null || select!=undefined){
              y.seleccionado = true
            }else{
              y.seleccionado = false
            }
          });
        }
    
        this.fotoUrl =(data.vFoto !== undefined && data.vFoto !== null)? data.vFoto! : this.foto!;

        this.listaPerfil = data.listaPerfil!;
        this.nombres = data.vNombreCompleto!;
        this.documento = data.vDocumento!;
        this.codEstado = (data.swt!=null)? data.swt!.toString()! : "1";

      
      this.spinner.hideLoading();
    });
  }

  cambiaPaisDistrito(codPais: string = '', codDistrito: string = ''){
   
    this.changePais(codPais?codPais:'');

    this.codDistrito = codDistrito?codDistrito:'';
    if(this.codDistrito !== ''){
      var distFind = this.distritos.find(e => e.dist?.id === this.codDistrito);
      if(distFind !== undefined){
        var distrito: Distrito = distFind;
        this.distritoColor = 'primary';
        this.controlDistritos.setValue(distrito);
      }
      else{
        this.distritoColor = 'accent';
        this.controlDistritos.setValue(new Distrito());
      }
    }else{
      this.distritoColor = 'accent';
      this.controlDistritos.setValue(new Distrito());
    }
  }


  subirFoto(fileInput: any) {
    this.webcamImage = null;
    this.showWebcam = false;
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.fotoUrl = imgBase64Path;
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.toggleWebcam();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  obtenerSubtabla(tb: TbMaestra[], cod: string){
    return tb.filter(e => e.vEtiqueta?.toString()?.trim() === cod);
  }

  resetImage(){
    this.fotoUrl = '';
    this.webcamImage = null;
    this.showWebcam = false;
  }

  changestepper(stepper: any, numTab: number = -1){
    if(numTab === -1)
      this.currentTab = stepper._selectedIndex;
    else
      this.currentTab = numTab;
  }

  cambiaFechaNac(dateStr: string){
    var arrDate = this.separarFecha(dateStr);
    if(arrDate.length === 0)
      this.fechaNac = null;
    else{
      var d = new Date(arrDate[2], arrDate[1]-1, arrDate[0]);
      if(d < this.minDate || d > this.maxDate)
        this.fechaNac = null;
      else
        this.updateFechaNac(d);
    }
  }

  separarFecha(cad: string){
    var arrStr: string[] = [];
    var arr: number[] = [];
    arrStr = cad.split('/');
    if(arrStr.length !== 3)
      return arr;
    else{
      for (let str of arrStr){
        let num = parseInt(str);
        if(num === null){
          arr = [];
          break;
        }
        else
          arr.push(num)
      }
      return arr;
    }
  }

  updateFechaNac(d: Date){
    this.fechaNac = d;
    if(this.form.get('nEdad') !== undefined){
      var edad = this.calcularEdad(d);
      this.form.patchValue({
        nEdad: edad.toString()
      });
    }
  }

  calcularEdad(date: Date) {
    var hoy = new Date();
    var cumpleanos = new Date(date);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }

    return edad;
  }

  changeestado(estado: string){
    this.codEstado= estado;
  }

  seleccionarPerfil(id: number, seleccionado: boolean){
    var result  = this.listaPerfil.filter(y=>y.nIdPerfil == id)[0];
    result!.seleccionado= (seleccionado==false)? true : false;
  }

  async listarDistritos(tbDpto: Ubigeo[], tbProv: Ubigeo[], tbDist: Ubigeo[]){
    var tbDptos: Ubigeo[] = tbDpto;
    var tbProvs: Ubigeo[] = tbProv;
    var tbDists: Ubigeo[] = tbDist;

    if(tbDptos==null && tbProvs==null && tbDists==null){
      tbDptos = jsonDepartamento;
      tbProvs = jsonProvincia;
      tbDists = jsonDistrito;
    }
   
  
    return new Promise(async (resolve) => {
      tbDists.sort((a, b) => (a.name === undefined || b.name === undefined) ? 1 : (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)));
      
      tbDists.forEach(d => {
        var distrito: Distrito = new Distrito();

        distrito.dist = d;
        distrito.prov = tbProvs.find(e => d.id?.startsWith(e.id!));
        distrito.dpto = tbDptos.find(e => d.id?.startsWith(e.id!));

        this.distritos.push(distrito);
      });
  
      this.filterDistritos = this.controlDistritos.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string'?value:value.dist.descripcion)),
        map(name  => (name?this.buscarDistritos(name):[]))
      )

      if(this.distritos.length === 0)
        resolve('error')
      else
        resolve('ok')
    })
  }

  buscarDistritos(name: string): Distrito[]{
    this.codDistrito = '';
    var results: Distrito[] = [];
    if(name.length >= this.carBuscaDistrito){
      var filtro = name.toLowerCase();
      results = this.distritos.filter(e => e.dist?.name?.toLowerCase().includes(filtro));
    }    
    return results.slice(0,this.nroDistritosMuestra);
  }

  obtenerPersona(e?: any){
    
    var tipoDocu =this.form.value['vTipDocu']
    var documento =this.form.value['vDocumento']

    var validacion = this.validaDocumento(tipoDocu, documento);

    if(validacion === ''){
      this.usuarioService.obtenerPersona(tipoDocu, documento).subscribe(data=>{

        data.vTipDocu = (data.vTipDocu==null)?  this.idTipoDocumento: data.vTipDocu;
        data.nPeso = (data.nPeso==0)?  null!: data.nPeso!;
        data.nTalla = (data.nTalla==0)?  null!: data.nTalla!;
        data.vCodPais = (data.vCodPais=='' || data.vCodPais==null)?  this.peru!: data.vCodPais!;

        this.selectedPais = data.vCodPais;
        this.muestraDistrito = true;
        if(this.selectedPais !== this.peru){
          this.codDistrito = '';
          this.distritoColor = 'accent';
          this.muestraDistrito = false;
        }

        if(data.vDocumento!="" && data.vDocumento!=null){
          this.form.patchValue({
            vApPaterno: data.vApPaterno,
            vApMaterno: data.vApMaterno,
            vPrimerNombre: data.vPrimerNombre,
            vSegundoNombre: data.vSegundoNombre,
            vSexo: data.vSexo,
            nEdad: data.nEdad,
            dFechaNac: data.dFechaNac,
            vEstCivil: data.vEstCivil,
            vCodPais: data.vCodPais,
            vCodDepa: data.vCodDepa,
            vCodProv: data.vCodProv,
            vCodDist: data.vCodDist,
            vDireccion: data.vDireccion,
          });

          this.codDepartamento = data.vCodDepa!;
          this.codProvincia = data.vCodProv!;
          this.codDistrito = data.vCodDist!;
      
          this.cambiaPaisDistrito(data.vCodPais, data.vCodDist);

          this.nombres = data.vNombreCompleto!;
          this.documento = data.vDocumento!;
          this.codEstado = (data.swt!=null)? data.swt!.toString()! : "1";

        }else{
          this.poclabService.obtenerPersona("1", documento).subscribe(data=>{
           
            let pais = (data.vCodPais='PER')? this.peru : data.vCodPais;
            this.selectedPais = this.peru;
            this.muestraDistrito = true;

            if(data.vDocumento!="" && data.vDocumento!=null){
              this.form.patchValue({
                vApPaterno: data.vApePaterno,
                vApMaterno: data.vApeMaterno,
                vPrimerNombre: data.vPrimerNombre,
                vSegundoNombre: data.vSegundoNombre,
                vSexo: data.vSexo,
                nEdad: data.nEdad,
                dFechaNac: data.dteNacimiento,
                // vEstCivil: data.vCodEstadoCivil,
                vCodPais: pais,
                vCodDepa: data.vCodRegion,
                vCodProv: data.vCodProvincia,
                vCodDist: data.vCodDistrito,
                vDireccion: data.vDireccion,
              });
              debugger;
              this.codDepartamento = data.vCodRegion!;
              this.codProvincia = data.vCodProvincia!;
              this.codDistrito = data.vCodDistrito!;
    
              this.cambiaPaisDistrito(pais, data.vCodDistrito);
    
              this.nombres = data.vApePaterno + " "+ data.vApeMaterno + " "+ data.vPrimerNombre + " "+data.vSegundoNombre
              this.documento = data.vDocumento!;
              this.codEstado = "1"; 
            }             
          });
        }
      });
    }else{
      if(validacion !== 'El tipo de documento y el documento no pueden estar vacíos')
        this.notifierService.showNotification(2,'Mensaje',validacion);
        this.borrarDato();
    } 
  }

  borrarDato(){
    this.form.patchValue({
      vApPaterno: null,
      vApMaterno: null,
      vPrimerNombre: null,
      vSegundoNombre: null,
      vSexo: null,
      nEdad: null,
      dFechaNac: null,
      vEstCivil: null,
    });
   
    this.cambiaPaisDistrito(this.peru, null!);
  }
  
  validaDocumento(tipoDocu: string, numDocu: string){
    if(tipoDocu == '' && numDocu == '')
        return 'El tipo de documento y el documento no pueden estar vacíos';

    var noEsNro = !this.esEntero(numDocu);
    
    //DNI
    if(tipoDocu == '00001'){
      if(numDocu==null  || numDocu=="")
        return 'Ingrese el Nro Documento';
      if(numDocu.length !== 8)
        return 'El DNI debe tener 8 dígitos';
      if(noEsNro)
        return 'El DNI debe debe contener solo números';
    }

    //PASS
    if(tipoDocu == '00002'){
      if(numDocu==null || numDocu=="")
        return 'Ingrese el Nro Documento';
      if(numDocu.length > 12)
        return 'El PASS no puede exceder 12 dígitos';
    }

    //CEXT
    if(tipoDocu == '00004'){
      if(numDocu==null || numDocu=="")
        return 'Ingrese el Nro Documento';
      if(numDocu.length > 12)
        return 'El CEXT no puede exceder 12 dígitos';
    }

    //HC, DIN, PARTNAC, NEO, OTROS
    if(numDocu==null || numDocu=="")
        return 'Ingrese el Nro Documento';

    return '';
  }

  esEntero(cadena: string){
    const regex = /^[0-9]+$/;
    return regex.test(cadena);
  }


  mostrarDistrito(d: Distrito): string{
    var result = '';
    if(d !== undefined && d !== null && d !== '' && d.dist?.name !== '')
      result = d.dist?.name! + ', ' + d.prov?.name! + ', ' + d.dpto?.name!;
    return result;
  }

  changePais(value: string){
    this.selectedPais = value;
    this.muestraDistrito = true;
    if(this.selectedPais !== '01'){
      this.distritoColor = 'accent';
      this.muestraDistrito = false;
    }
  }

  changeDistrito(event: any){
    var distrito = event.option.value;
    if(distrito !== undefined){
      this.codDepartamento = distrito.dpto.id;
      this.codProvincia = distrito.prov.id;
      this.codDistrito = distrito.dist.id;
    }
  }

  guardar(){
    let model = new Usuario();

    model.nIdUsuario= this.form.value['nIdUsuario'];
    model.nIdPersona= this.form.value['nIdPersona'];
    model.vTipDocu= this.form.value['vTipDocu'];
    model.vDocumento= this.form.value['vDocumento'];
    model.vApPaterno= this.form.value['vApPaterno'];
    model.vApMaterno= this.form.value['vApMaterno'];
    model.vPrimerNombre= this.form.value['vPrimerNombre'];
    model.vSegundoNombre= this.form.value['vSegundoNombre'];
    model.vSexo= this.form.value['vSexo'];
    model.vEstCivil= this.form.value['vEstCivil'];
    model.dFechaNac= this.form.value['dFechaNac'];
    model.nEdad= (this.form.value['nEdad']==null || this.form.value['nEdad']=="")? null : this.form.value['nEdad'].toString();
    model.vCelular=  (this.form.value['vCelular']==null || this.form.value['vCelular']=="")? null : this.form.value['vCelular'].toString();
    model.vTelefono=  (this.form.value['vCelular']==null || this.form.value['vCelular']=="")? null : this.form.value['vTelefono'].toString();
    model.vCorreo1= this.form.value['vCorreo1'];
    model.vCorreo2= this.form.value['vCorreo2'];
    model.nPeso= (this.form.value['nPeso']==null || this.form.value['nPeso']=="")? null :  this.form.value['nPeso'].toString();
    model.nTalla=(this.form.value['nTalla']==null || this.form.value['nTalla']=="")? null :  this.form.value['nTalla'].toString();
    model.vCodPais = (this.selectedPais=='')?null!:this.selectedPais;
    
    if(this.selectedPais==this.peru){
      model.vCodDepa = (this.codDepartamento=='')?null!:this.codDepartamento;
      model.vCodProv = (this.codProvincia=='')?null!:this.codProvincia;
      model.vCodDist = (this.codDistrito=='')?null!:this.codDistrito;
    }else{
      model.vCodDepa = null!;
      model.vCodProv = null!;
      model.vCodDist = null!;
    }

    model.vDireccion= this.form.value['vDireccion'];
    model.vUsuario= this.form.value['vUsuario'];
    model.vContrasena= this.form.value['vContrasena'];
    model.vColegiatura= this.form.value['vColegiatura'];

    model.swt= Number(this.codEstado);
    model.listaPerfil = this.listaPerfil;

    if(this.fotoUrl!='' && this.fotoUrl!=environment.UrlImage + "people.png"){
      model.vFoto = this.webcamImage?this.webcamImage.imageAsDataUrl:this.fotoUrl;
    }


    this.spinner.showLoading();
    this.usuarioService.guardar(model).subscribe(data=>{

    this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);

      if(data.typeResponse==environment.EXITO){
        this.router.navigate(['/page/configuracion/usuario']);
        this.spinner.hideLoading();
      }else{
        this.spinner.hideLoading();
      }
    });

  }

  limpiar(){
    this.inicializar();

    this.listarCombo();
  }

}
