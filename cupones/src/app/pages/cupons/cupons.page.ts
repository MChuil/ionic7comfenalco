import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, NavController, NavParams } from '@ionic/angular';
import { Cupon } from 'src/app/models/cupon';
import { CuponsService } from 'src/app/services/cupons.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-cupons',
  templateUrl: './cupons.page.html',
  styleUrls: ['./cupons.page.scss'],
})
export class CuponsPage implements OnInit {

  public cupons: Cupon[];
  public cuponsActive: boolean = false;
  public showCamera: boolean;

  constructor(private cuponService: CuponsService, private navParams: NavParams, private navCtrl: NavController, private AlertCtrl: AlertController, private toastService: ToastService) {
    this.cupons = [];
    this.showCamera = false;
  }

  async ngOnInit() {
    this.cupons = await this.cuponService.getCupons();
  }

  changeActive(cupon: Cupon){
    cupon.active = !cupon.active
    this.cuponsActive = this.cupons.some(c => c.active)
  }

  goToCard(){
    this.navParams.data['cupons'] = this.cupons.filter(c => c.active)
    this.navCtrl.navigateForward('card')
  }

  async startCamera(){
    this.showCamera = true;
    //verificar permisos
    const camera = await BarcodeScanner.checkPermissions()
    if(camera){
      document.querySelector('body')?.classList.add('barcode-scanner-active');
      // Add the `barcodeScanned` listener
      const listener = await BarcodeScanner.addListener(
        'barcodeScanned',
        async result => {
          console.log(result.barcode);
          let cupon: Cupon = JSON.parse(result.barcode.displayValue)
          //validar el cupon
          if(this.isCuponValid(cupon)){
            this.toastService.presentToast('QR escaneado correctamente', 'top');
            this.cupons.push(cupon)
          }else{
            this.toastService.presentToast('QR error', 'top');
          }
          this.closeCamera()
        },
      );
      // Start the barcode scanner
      await BarcodeScanner.startScan();
    }else{
      const alert = await this.AlertCtrl.create({
        message: 'Es necesario permiso de la camara para que la app funcione'
      });
      await alert.present();
    }
  
  }

  async closeCamera(){
    this.showCamera = false;
    document.querySelector('body')?.classList.remove('barcode-scanner-active');
    // Remove all listeners
    await BarcodeScanner.removeAllListeners();

    // Stop the barcode scanner
    await BarcodeScanner.stopScan();
  }


  private isCuponValid(cupon: Cupon){
    return cupon && cupon.id_product && cupon.img && cupon.name && cupon.discount
  }
}
