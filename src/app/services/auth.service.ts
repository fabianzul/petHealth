import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap, tap, map, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: any = null;

  //private afAuthAuxiliar: firebase.app.App;
  //private afAuthAuxiliar: firebase.app.App;

  constructor(
    public afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
  ) {

    //afs.firestore.settings({ timestampsInSnapshots: true });
    //this.afAuthAuxiliar = firebase.initializeApp(environment.firebaseConfig, "secondApp");
    //// Get auth data, then get firestore user document || null
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });
  }


  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }


  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.authState['displayName'] || 'User without a Name' }
  }


  //// Social Auth ////
  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    provider.setCustomParameters({
      hd: "lumindtech.com"
    });
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user
        //this.updateUserData()
        return true;
      })
      .catch(
        error => {
          console.log(error);
          return false;
        }
      );
  }

  //// Sign Out ////
  signOut(): void {
    this.afAuth.auth.signOut().then(() => {
      sessionStorage.removeItem('tokenK');
      sessionStorage.removeItem('displayName');
      sessionStorage.removeItem('userName');
      console.log("saliendo");
      this.router.navigate(['/'])
    });
  }



  loginEmail(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(
          userData => {
            userData.user.getIdTokenResult().then((idtoken) => {
              console.log(idtoken.claims)
            })
            resolve(userData)
          },
          err => reject(err)
        );
    });
  }

  loginGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  }

  getAuth() {
    return this.afAuth.authState.pipe(map(auth => auth));
  }

  getCurrentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  getUserData(uid) {

  }

  loginUserData(uid) {
    return new Promise<any>((resolve, reject) => {
      this.db.object(`users/${uid}`).query.once("value").then(a => {
        const data = a as any;
        //console.log(data);
        resolve(data.val());
      })
    });
    //console.log(res);
  }

  getCustomClaims(){

  }

  /*logout() {
    return this.afAuth.auth.signOut();
  }*/

  //Solo usuario maestro y administrador
  registerUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {

    });
  }

  deleteUser(uid: string) {
    return new Promise((resolve, reject) => {

    });
  }

}
