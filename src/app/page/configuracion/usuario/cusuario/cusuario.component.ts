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

  foto?: string =environment.UrlImage + "people.png";
  fotoUrl: string = '';

  //Webcam
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private configPermisoService : ConfigPermisoService,
  ) { }

  ngOnInit(): void {

    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    
    this.inicializar();

    this.obtenerpermiso();
  }

  inicializar(){
    this.form = new FormGroup({
      // 'idePreDonante': new FormControl({ value: 0, disabled: false}),
      // 'tipoExtraccion': new FormControl({ value: '', disabled: true}),
      // 'codigo': new FormControl({ value: '', disabled: false}),
      // 'fecha': new FormControl({ value: new Date(), disabled: false}),
      // 'pesoDonacion': new FormControl({ value: '', disabled: false}),
      // 'tallaDonacion': new FormControl({ value: '', disabled: false}),
      // 'hemoglobina': new FormControl({ value: '', disabled: false}),
      // 'hematocrito': new FormControl({ value: '', disabled: false}),
      // 'plaquetas': new FormControl({ value: '', disabled: false}),
      // 'presionArterial1': new FormControl({ value: '', disabled: false}),
      // 'presionArterial2': new FormControl({ value: '', disabled: false}),
      // 'presionArterial': new FormControl({ value: '', disabled: false}),
      // 'frecuenciaCardiaca': new FormControl({ value: '', disabled: false}),
      // 'ideGrupo': new FormControl({ value: '', disabled: false}),
      // 'aspectoGeneral': new FormControl({ value: '', disabled: false}),
      // 'lesionesVenas': new FormControl({ value: '', disabled: false}),
      // 'estadoVenoso': new FormControl({ value: '', disabled: false}),
      // 'obsedrvaciones': new FormControl({ value: '', disabled: false}),
      // 'temperatura': new FormControl({ value: '', disabled: false})
    });
  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.usuario.codigo).subscribe(data=>{
      this.permiso = data;
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

  resetImage(){
    this.fotoUrl = '';
    this.webcamImage = null;
    this.showWebcam = false;
  }




  guardar(){

  }


}
