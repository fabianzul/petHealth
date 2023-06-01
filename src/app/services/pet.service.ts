import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { take, map, switchMap, finalize, catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { petRealTime } from '../models/pet'

@Injectable({
  providedIn: 'root'
})
export class PetService {
  petRealTime: Observable<petRealTime>;

  
  constructor(private db: AngularFireDatabase) {
  }

  public getPetRealTime(id: string): Observable<any> {
    return this.db.object<petRealTime>(`pe/${id}`).snapshotChanges();
  }

  public getPetsRealTime(): Observable<any> {
    return this.db.list(`pets/`, ref => ref.orderByChild('id')).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() as any }))
      )
    );
  }

}
