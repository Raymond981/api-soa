import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(private firestore: AngularFirestore) { }

  
  searchEmail(email){
    return this.firestore.collection('/users',ref => ref.where('correo', '>=', email)
      .where('correo', '<=', email + '\uf8ff'))
      .snapshotChanges()  }


  getViajes() {
    return this.firestore.collection('viajes').snapshotChanges();
  }

  createViaje(data: any) {
    return this.firestore.collection('viajes').add(data);
  }

  updatePolicy(data: any) {
    delete data.id;
    this.firestore.doc('viajes/' + data.id).update(data);
  }

  deletePolicy(data: string) {
    this.firestore.doc('viajes/' + data).delete();
  }


  buscarViaje(data:any){
    return this.firestore.collection('viajes',ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      query.where('destino', '>=', data.destino)
      query.where('destino', '<=', data.destino)
      query.where('origen', '>=', data.origen)
      query.where('origen', '<=', data.origen)
      return query
    }).snapshotChanges()  
  }


}
