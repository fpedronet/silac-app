import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import forms from 'src/assets/json/formulario.json';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';

import { Permiso } from 'src/app/_model/permiso';
import { map, Observable, startWith, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { TbmaestraService } from 'src/app/_service/tbmaestra.service';
import { TbMaestra } from 'src/app/_model/combobox';
import { Perfil } from 'src/app/_model/configuracion/perfil';
import { Usuario } from 'src/app/_model/configuracion/usuario';

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

  tablasMaestras = ['TDOC', 'SEXO'];
  listaTipoDocumento?: TbMaestra[] = [];
  listaTipoGenero?: TbMaestra[] = [];
  listaPerfil: Perfil[] = [];

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
      'vUsuario': new FormControl({ value: '', disabled: false}),
      'vContrasena': new FormControl({ value: '', disabled: false}),
      'vColegiatura': new FormControl({ value: '', disabled: false})
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
        'vUsuario': new FormControl({ value: data.vUsuario, disabled: false}),
        'vContrasena': new FormControl({ value: data.vContrasena, disabled: false}),
        'vColegiatura': new FormControl({ value: data.vColegiatura, disabled: false})
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
