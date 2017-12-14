import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, RequestOptions, Http } from '@angular/http';
import { AppComponent } from './app.component';
import { MatSidenavModule } from '@angular/material';
import { GlobalEventsManager } from './globalEventsManager';
import { RouterModule } from '@angular/router';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { ToastOptions } from 'ng2-toastr';
import { CustomOption } from './toast-options';
import { NavbarModule } from './nav/navbar/navbar.module';
import { SidebarModule } from './nav/sidebar/sidebar.module';
import { UserModule } from './user/user.module';
// import { AutocompleteComponent } from './autocomplete/autocomplete.component'
import { AppRoutingModule } from './appRouting.module';
import { AuthGuardService } from './auth/authguard.service';
import { AuthService } from './auth/auth.service';
import { ErrorService } from './errorHandler/error.service';
import { ErrorComponent } from './errorHandler/error.component';
import { ErrorPageComponent } from './errorPage/errorPage.component';
import { PaiementGuardService } from './companie/single/paiement/paiementGuard.service';
import { LoadingInAppModule } from './nav/loadingInApp/loadingInApp.module';


export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({}), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    ErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule,
    RouterModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    FormsModule,
    NavbarModule,
    SidebarModule,
    MatSidenavModule,
    UserModule,
    LoadingInAppModule,
  ],
  exports: [],
  providers: [
    AuthGuardService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthService,
    ErrorService,
    PaiementGuardService,
    GlobalEventsManager,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    { provide: ToastOptions, useClass: CustomOption },
  ],
  entryComponents: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
