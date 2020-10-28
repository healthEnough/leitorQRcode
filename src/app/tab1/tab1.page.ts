import { ChangeDetectorRef, Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AlertController, Platform } from '@ionic/angular'
import { Historico } from '../historico';
import { HistoricoService } from '../service/historico.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  leitorQRcode
  leitura
  link = false
  footer: HTMLElement
  content: HTMLElement
  imgLogo: HTMLElement

  constructor(
    private qrScanner: QRScanner,
    private alert: AlertController,
    private platform: Platform,
    private screen: ScreenOrientation,
    private cdRef: ChangeDetectorRef,
    private historico: HistoricoService
  ) 
  {
    this.screen.lock(this.screen.ORIENTATIONS.LANDSCAPE)
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.content.style.opacity = '1'
      this.imgLogo.style.opacity = '1'
      this.footer.style.opacity = '1'
      this.leitura = null
      this.link = false
      this.qrScanner.hide()
      this.leitorQRcode.unsubscribe()
    })
  }

  verificaLink(a: string) {
    const inicio = a.substring(0, 4)
    if(inicio=='www.'||inicio=='http') {
      this.link = true
    } else {
      this.link = false
    }
  }

  async show(a: string, b: string)
  {
     const alert = await this.alert.create({
      header: a,
      message: b,
      buttons: ['OK']
    })
    await alert.present() 
  }

   lerQRcode() {
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        this.content = document.getElementsByTagName('ion-content')[0] as HTMLElement
        this.imgLogo = document.getElementById('logo') as HTMLElement
        this.footer = document.getElementById('footer') as HTMLElement
        this.content.style.opacity = '0'
        this.imgLogo.style.opacity = '0'
        this.footer.style.opacity = '0'

        this.qrScanner.show()
        this.leitorQRcode = this.qrScanner.scan().subscribe(async (text: string) => {
          this.leitura = (['result'])?text['result']: text
          this.content.style.opacity = '1'
          this.imgLogo.style.opacity = '1'
          this.footer.style.opacity = '1'
          this.qrScanner.hide()
          this.leitorQRcode.unsubscribe()
          this.verificaLink(this.leitura)
          this.cdRef.detectChanges()
          const historico = new Historico()
          historico.leitura = this.leitura
          historico.dataHora = new Date()
          await this.historico.create(historico).then(resp => {
            console.log(resp)
          }).catch(e => {
            this.show('Error', 'Erro ao salvar no firebase')
          })
         })
       } else if (status.denied) {
       } else {
       }
    })
    .catch((e: any) => this.show('Error is', e))
  }

}
