import { Component, OnInit, HostListener, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { moveIn } from '../../../router.animations';
import { MatSnackBar } from '@angular/material';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { ISubscription } from 'rxjs/Subscription';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  animations: [moveIn()],
  host: { '[@moveIn]': '' }
})
export class LoginPageComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passFormControl = new FormControl('', [
    Validators.required,
  ]);

  matcher = new MyErrorStateMatcher();

  hide = true;

  progress= false;

  subCurrentUser: ISubscription;

  //@ViewChild('loginButton') private loginButton: any;
  //@ViewChild('nameForMaterialElement', {read: ElementRef}) private nameForMaterialElement: ElementRef;
  @ViewChild('loginButton', { read: ElementRef , static: false}) private loginButton: ElementRef;
  @ViewChild('pass', { read: ElementRef , static: false}) private pass: ElementRef;
  @ViewChild('mail', { read: ElementRef, static: false }) private mail: ElementRef;

  //matcher = new MyErrorStateMatcher();

  constructor(
    public authService: AuthService,
    public router: Router,
    public snackBar: MatSnackBar
  ) {
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.loginButton.nativeElement.click();
    }
  }

  ngOnInit() {      
      this.subCurrentUser = this.authService.currentUserObservable.subscribe(a=>{
        if(a!=null){
          this.afterSignIn();
        }else{
          
        }
      }) 
  }
  
  ngOnDestroy(){
    if(this.subCurrentUser!=null){
      this.subCurrentUser.unsubscribe();
    }
  }


  private afterSignIn(): void {
    // Do after login stuff here, such router redirects, toast messages, etc.

    this.authService.loginUserData(this.authService.getCurrentUserId()).then(val=>{
      this.snackBar.open('Bienvenido, ' + val.name, '', {
        duration: 3000,
        panelClass: ['normal-snackbar'],
        horizontalPosition: 'center',
      });
    });

    this.router.navigate(['/dashboard']);
    //this.authService.logout();
  }

  signInWithGoogle(): void {
    //this.authService.signOut();
    this.authService.googleLogin()
      .then(
        (result) => {
          console.log(result);
          if (result) {
            this.afterSignIn()
          } else {
            console.log("Not loged")
          }
        }
      );
  }

  signInWithEmail(email, pass): void {

    this.pass.nativeElement.disabled = true;
    this.mail.nativeElement.disabled = true;
    this.loginButton.nativeElement.disabled = true;
    this.progress = true;


    this.authService.loginEmail(email.value, pass.value).then(
      (result) => {
        //console.log(result);
        if (result) {
          this.afterSignIn()
        } else {
          console.log("Not loged");
          this.pass.nativeElement.disabled = false;
          this.mail.nativeElement.disabled = false;
          this.loginButton.nativeElement.disabled = false;
          this.progress = false;
        }
      }
    ).catch((error: firebase.FirebaseError) =>{
      console.log(error.message);
      this.manageError(error.code);
      this.pass.nativeElement.disabled = false;
      this.mail.nativeElement.disabled = false;
      this.loginButton.nativeElement.disabled = false;
      this.progress = false;
    })
  }

  manageError(result){
    console.log("error: " + result );
    switch(result){
      case "auth/wrong-password":
      this.snackBar.open('Error! la contraseña es incorrecta', '', {
        duration: 3000,
        panelClass: ['red-snackbar'],
        horizontalPosition: 'center',
      });
      break;
      case "auth/user-not-found":
      this.snackBar.open('Error! el usuario no existe', '', {
        duration: 3000,
        panelClass: ['red-snackbar'],
        horizontalPosition: 'center',
      });
      break;
      case "auth/too-many-requests":
      this.snackBar.open('Error! Demasiadas peticiones, inténtelo de nuevo en unos minutos', '', {
        duration: 3000,
        panelClass: ['red-snackbar'],
        horizontalPosition: 'center',
      });
      break;
      case "auth/invalid-email":
      this.snackBar.open('Error! Debe introducir un usuario y contraseña', '', {
        duration: 3000,
        panelClass: ['red-snackbar'],
        horizontalPosition: 'center',
      });
      break;
    }

  }


}
