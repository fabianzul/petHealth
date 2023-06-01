import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, filter, withLatestFrom } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatSnackBar, MatSidenav, MatMenuTrigger, MatMenu } from '@angular/material';
import { ISubscription } from 'rxjs/Subscription';
import * as _ from "lodash";

@Component({
  selector: 'app-components/nav-page',
  templateUrl: './nav-page.component.html',
  styleUrls: ['./nav-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavPageComponent implements OnInit {
  @ViewChild('drawer',{ read: MatSidenav, static: true }) drawer: MatSidenav;
  @ViewChild('notifyMenu',{ read: MatMenu, static: true }) noti: MatMenu;
  @ViewChild(MatMenuTrigger,{static:false}) menu: MatMenuTrigger; 
  

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  public subSensorNotifications: ISubscription;
  public subSensorNotificationsCounter: ISubscription;

  public quantityNotify: number;

  isLoading = true;

  userToken;

  constructor( private breakpointObserver: BreakpointObserver, public authService: AuthService, private router: Router, private snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.authService.currentUserObservable.subscribe(auth => {
      //console.log(auth);
      if (auth) {

        this.authService.authState.getIdTokenResult()
        .then((idTokenResult) => {
          // Confirm the user is an Admin.
          this.userToken = idTokenResult.claims;
          
        })
        .catch((error) => {
          console.log(error);
        });
        
      } else {
        if (this.subSensorNotifications != null) {
          this.subSensorNotifications.unsubscribe();
        }
        if(this.subSensorNotificationsCounter != null){
          this.subSensorNotificationsCounter.unsubscribe();
        }
      }
    });
  }

  public logout() {
    this.authService.signOut();
    this.snackBar.open('Hasta Pronto!', '', {
      duration: 3000,
      panelClass: ['normal-snackbar'],
      horizontalPosition: 'center',
    });
    /*setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);*/
  }

  public route(page) {
    this.router.navigate([page]);
    this.drawer.close();
    this.closeMenu();
  }

  closeMenu() {
    this.menu.closeMenu();
  }

  public snackNotify(msg: string, delay: number) {
    this.snackBar.open(msg, '', {
      duration: delay,
      panelClass: ['normal-snackbar'],
      horizontalPosition: 'center',
    });
  }


}