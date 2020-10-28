import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Historico } from '../historico';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  create(historico: Historico) {
    return this.firestore.collection('historicos').add({
      ...historico
    })
  }

  getAll() {
    return this.firestore.collection('historicos').snapshotChanges()
  }

  update(key:string,historico:Historico) {
    return this.firestore.doc(`historicos/${key}`).update(historico)
  }

  delete(key:string) {
    return this.firestore.doc(`historicos/${key}`).delete()
  }

}
