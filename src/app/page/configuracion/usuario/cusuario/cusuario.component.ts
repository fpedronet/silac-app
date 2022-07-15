import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  codEstado: string = "0";
  nombres: string = "";
  documento: string = "";
  currentTab: number = 0;

  fechaNac: Date | null = null;
  maxDate: Date = new Date();
  minDate: Date = new Date();

  tablasMaestras = ['TDOC', 'SEXO','ESCIV'];
  listaTipoDocumento?: TbMaestra[] = [];
  listaTipoGenero?: TbMaestra[] = [];
  listaEstadoCivil?: TbMaestra[] = [];
  listaPerfil: Perfil[] = [];
  // listaPais: Ubigeo[] = [];
  listaPais: Ubigeo[] = jsonPais;


  codDistrito: string = '';
  controlDistritos = new FormControl();
  filterDistritos: Observable<Distrito[]> | undefined;
  distritos: Distrito[] = [];
  carBuscaDistrito: number = 2;
  nroDistritosMuestra: number = 15;

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
    private tbmaestraService : TbmaestraService
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

    this.listarDistritos();

    this.listarCombo();
  }

  inicializar(){
    this.form = new FormGroup({
      'nIdUsuario': new FormControl({ value: 0, disabled: false}),
      'nIdPersona': new FormControl({ value: 0, disabled: false}),
      'vDocumento': new FormControl({ value: '', disabled: false}),
      'vTipDocu': new FormControl({ value: '', disabled: false}),
      'vApPaterno': new FormControl({ value: '', disabled: false}),
      'vApMaterno': new FormControl({ value: '', disabled: false}),
      'vPrimerNombre': new FormControl({ value: '', disabled: false}),
      'vSegundoNombre': new FormControl({ value: '', disabled: false}),
      'vSexo': new FormControl({ value: '', disabled: false}),
      'nEdad': new FormControl({ value: '', disabled: false}),
      'dFechaNac': new FormControl({ value: '', disabled: false}),
      'vEstCivil': new FormControl({ value: '', disabled: false}),
      'vUsuario': new FormControl({ value: '', disabled: false}),
      'vContrasena': new FormControl({ value: '', disabled: false}),
      'vColegiatura': new FormControl({ value: '', disabled: false}),
      'vCelular': new FormControl({ value: '', disabled: false}),
      'vTelefono': new FormControl({ value: '', disabled: false}),
      'vCorreo1': new FormControl({ value: '', disabled: false}),
      'vCorreo2': new FormControl({ value: '', disabled: false}),
      'nPeso': new FormControl({ value: '', disabled: false}),
      'nTalla': new FormControl({ value: '', disabled: false}),
      'vCodPais': new FormControl({ value: '', disabled: false}),
      'vCodDepa': new FormControl({ value: '', disabled: false}),
      'vCodProv': new FormControl({ value: '', disabled: false}),
      'vCodDist': new FormControl({ value: '', disabled: false}),
      'vDireccion': new FormControl({ value: '', disabled: false})
    });
  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.usuario.codigo).subscribe(data=>{
      this.permiso = data;
    });   
  }

  listarCombo(){
    this.tbmaestraService.cargarDatos(this.tablasMaestras).subscribe(data=>{
      this.listaTipoDocumento = this.obtenerSubtabla(data.items,'TDOC');
      this.listaTipoGenero = this.obtenerSubtabla(data.items,'SEXO');
      this.listaEstadoCivil = this.obtenerSubtabla(data.items,'ESCIV');
      this.obtener();
    });
  }

  obtener(){
    this.usuarioService.obtener(this.id).subscribe(data=>{
      this.form = new FormGroup({
        'nIdUsuario': new FormControl({ value: data.nIdUsuario, disabled: false}),
        'nIdPersona': new FormControl({ value: data.nIdPersona, disabled: false}),
        'vDocumento': new FormControl({ value: data.vDocumento, disabled: false}),
        'vTipDocu': new FormControl({ value: data.vTipDocu, disabled: false}),
        'vApPaterno': new FormControl({ value: data.vApPaterno, disabled: false}),
        'vApMaterno': new FormControl({ value: data.vApMaterno, disabled: false}),
        'vPrimerNombre': new FormControl({ value: data.vPrimerNombre, disabled: false}),
        'vSegundoNombre': new FormControl({ value: data.vSegundoNombre, disabled: false}),
        'vSexo': new FormControl({ value: data.vSexo, disabled: false}),
        'nEdad': new FormControl({ value: data.nEdad, disabled: false}),
        'dFechaNac': new FormControl({ value: data.dFechaNac, disabled: false}),
        'vEstCivil': new FormControl({ value: data.vEstCivil, disabled: false}),
        'vUsuario': new FormControl({ value: data.vUsuario, disabled: false}),
        'vContrasena': new FormControl({ value: data.vContrasena, disabled: false}),
        'vColegiatura': new FormControl({ value: data.vColegiatura, disabled: false}),
        'vCelular': new FormControl({ value: data.vCelular, disabled: false}),
        'vTelefono': new FormControl({ value: data.vTelefono, disabled: false}),
        'vCorreo1': new FormControl({ value: data.vCorreo1, disabled: false}),
        'vCorreo2': new FormControl({ value: data.vCorreo2, disabled: false}),
        'nPeso': new FormControl({ value: data.nPeso, disabled: false}),
        'nTalla': new FormControl({ value: data.nTalla, disabled: false}),
        'vCodPais': new FormControl({ value: data.vCodPais, disabled: false}),
        'vCodDepa': new FormControl({ value: data.vCodDepa, disabled: false}),
        'vCodProv': new FormControl({ value: data.vCodProv, disabled: false}),
        'vCodDist': new FormControl({ value: data.vCodDist, disabled: false}),
        'vDireccion': new FormControl({ value: data.vDireccion, disabled: false})
        });

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
    
      this.listaPerfil = data.listaPerfil!;
      this.nombres = data.vNombreCompleto!;
      this.documento = data.vDocumento!;
      this.codEstado = (data.swt!=null)? data.swt!.toString()! : "0";
      this.fotoUrl =(data.vFirma !== undefined && data.vFirma !== null)? data.vFirma! : this.foto!;

    });
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
    if(this.form.get('Edad') !== undefined){
      var edad = this.calcularEdad(d);
      this.form.patchValue({
        Edad: edad.toString()
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

  async listarDistritos(){
    var tbDpto: Ubigeo[] = jsonDepartamento;
    var tbProv: Ubigeo[] = jsonProvincia;
    var tbDist: Ubigeo[] = jsonDistrito;
  
    return new Promise(async (resolve) => {
      tbDist.sort((a, b) => (a.name === undefined || b.name === undefined) ? 1 : (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)));
      
      tbDist.forEach(d => {
        var distrito: Distrito = new Distrito();

        distrito.dist = d;
        distrito.prov = tbProv.find(e => d.id?.startsWith(e.id!));
        distrito.dpto = tbDpto.find(e => d.id?.startsWith(e.id!));

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

  mostrarDistrito(d: Distrito): string{
    var result = '';
    if(d !== undefined && d !== null && d !== '' && d.dist?.name !== '')
      result = d.dist?.name! + ', ' + d.prov?.name! + ', ' + d.dpto?.name!;
    return result;
  }

  changeDistrito(event: any){
    var distrito = event.option.value;
    if(distrito !== undefined){
      this.codDistrito = distrito.dist.codigo;
    }
  }

  guardar(){
    debugger;
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
    model.dFechaNac= this.form.value['dFechaNac'];
    model.nEdad= this.form.value['nEdad'];
    model.vUsuario= this.form.value['vUsuario'];
    model.vContrasena= this.form.value['vContrasena'];
    model.vColegiatura= this.form.value['vColegiatura'];
    model.swt= Number(this.codEstado);
    model.listaPerfil = this.listaPerfil;
    model.vFirma = this.webcamImage?this.webcamImage.imageAsDataUrl:this.fotoUrl;

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


}
