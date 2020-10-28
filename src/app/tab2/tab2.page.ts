import { Component } from '@angular/core';
import { Historico } from '../historico';
import { HistoricoService } from '../service/historico.service';
import localePtBr from '@angular/common/locales/pt'
import { registerLocaleData } from '@angular/common'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  listaHistorico: Historico[] = []

  constructor(
    private historico: HistoricoService
  ) {registerLocaleData(localePtBr)}

  buscarHistoricos() {
    this.listaHistorico = []
    this.historico.getAll().subscribe(dados => {
      this.listaHistorico = dados.map(registro => {
        return {
          $key: registro.payload.doc.id,
          leitura: registro.payload.doc.data()['leitura'],
          dataHora: new Date(registro.payload.doc.data()['dataHora']['seconds']*1000)
        } as Historico
      })
    })
  }

  async ionViewWillEnter() {
    this.buscarHistoricos()
  }

  deletar(key:string) {
    this.historico.delete(key)
    this.buscarHistoricos()
  }

}
