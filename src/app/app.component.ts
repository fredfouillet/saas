import {Component, ViewContainerRef, ViewChild, ElementRef} from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {
    Router,
    // import as RouterEvent to avoid confusion with the DOM Event
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router'
import {AuthService} from './auth/auth.service';
import {GlobalEventsManager} from './globalEventsManager';
import {MatSidenav} from '@angular/material';

import {tokenNotExpired} from 'angular2-jwt';

//

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  loading: boolean = true;
  isLoggedIn: boolean = false;
  @ViewChild('sidenav') public sidenav: MatSidenav;
  @ViewChild('container') elementView: ElementRef;
  modeSidenav: string = 'side'

  constructor(
    private globalEventsManager: GlobalEventsManager,
    private router: Router,
    private authService: AuthService,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef
  ) {

    if(window.screen.width < 1000) {
      this.modeSidenav = 'over'
    }
    this.globalEventsManager.showNavBarEmitter.subscribe((mode)=>{
        // mode will be null the first time it is created, so you need to igonore it when null
        if (mode !== null) {

          if(mode) {
            this.sidenav.open()
          } else {
            this.sidenav.close()
          }
          // this.showNavBar = mode;
          // this.fetchedUser = this.authService.getCurrentUser()
        }

        this.globalEventsManager.isLoggedInEmitter.subscribe((mode) => {
          if (mode !== null) {
            this.isLoggedIn = mode;
          }
        });

    });

    this.toastr.setRootViewContainerRef(vcr);
    router.events.subscribe((event: RouterEvent) => {
          this.navigationInterceptor(event);
      });

  }

  // openSideBar() {
  //
  //   this.globalEventsManager.showNavBar(true);
  // }

  // isLoggedIn() {
  //   // console.log(tokenNotExpired())
  //   // if (!tokenNotExpired()) {
  //   //   localStorage.clear();
  //   // }
  //   // return tokenNotExpired();
  // }

      // Shows and hides the loading spinner during RouterEvent changes
      navigationInterceptor(event: RouterEvent): void {
          if (event instanceof NavigationStart) {
              this.globalEventsManager.isLoadding(true);
          }
          if (event instanceof NavigationEnd) {
              this.globalEventsManager.isLoadding(false);
          }

          // Set loading state to false in both of the below events to hide the spinner in case a request fails
          if (event instanceof NavigationCancel) {
              this.globalEventsManager.isLoadding(false);
          }
          if (event instanceof NavigationError) {
              this.globalEventsManager.isLoadding(false);
          }
      }


  // isLoggedIn() {
  //   return this.authService.isLoggedIn();
  // }
}
