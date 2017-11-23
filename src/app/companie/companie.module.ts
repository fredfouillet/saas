import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule} from '@angular/router';

// import { CompanieDetailUsersComponent} from './companieDetailUsers.component';
// import { AddUserByCompanieComponent} from './addUser/addUserByCompanie.component';
import { CompaniesComponent} from './companies/companies.component';
import { CompanieComponent} from './single/companie.component';

import { DetailsCompanieComponent} from './single/detailsCompanie/detailsCompanie.component';
import { DetailsCalendarComponent} from './single/detailsCalendar/detailsCalendar.component';
import { CategProductComponent} from './single/categProduct/categProduct.component';
// import { EditAddUserToCompanieComponent} from './addUser/editAddUserToCompanie.component';
// import { CompanieDetailComponent} from './single/companieDetail.component';
import { CompanieService} from './companie.service';
import { CompanieRouting} from './companieRouting.module';
// import { MaterialModule } from '@angular/material';
import { CompanieDialogComponent } from './single/dialog/companieDialog.component';
import {SharedModule } from '../shared/shared.module';
// import {MatRadioModule} from '@angular/material';
import { PaiementService} from './paiement/paiement.service';
import { PaiementComponent } from './paiement/paiement.component';
import { ConnectStripeComponent } from './single/connectStripe/connectStripe.component';
import { PaiementPipe } from './paiement/paiement.pipe';
import {MatCardModule} from '@angular/material';
import {MatExpansionModule} from '@angular/material';
import {MatIconModule} from '@angular/material';
// import {MatInputModule} from '@angular/material';
// import {MatFormFieldModule} from '@angular/material';

@NgModule({
  imports: [

    CompanieRouting,
    // CommonModule,
    // FormsModule,
    // MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    // MatInputModule,
    // MatFormFieldModule,
    // MatRadioModule,

  ],
  declarations: [
    // CompanieDetailUsersComponent,
    CompaniesComponent,
    CompanieComponent,
    DetailsCompanieComponent,
    DetailsCalendarComponent,
    // EditAddUserToCompanieComponent,
    // CompanieDetailComponent,
    CompanieDialogComponent,
    PaiementComponent,
    PaiementPipe,
    ConnectStripeComponent,
    CategProductComponent,
    // AddUserByCompanieComponent,
  ],
  exports:      [ ],
  providers:    [ CompanieService, PaiementService ],
  entryComponents: [
    CompanieDialogComponent
  ]
})
export class CompanieModule { }
