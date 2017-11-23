import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule} from '@angular/router';
import { PaiementQuoteDialogComponent } from './single/dialog/paiementQuoteDialog.component'
import { MatCheckboxModule} from '@angular/material';
// import { ProjectModule} from '../project/project.module';
import {MatDatepickerModule} from '@angular/material';
import { PaiementQuotesComponent} from './paiementQuotes/paiementQuotes.component';
import { EditPaiementQuoteComponent} from './single/editPaiementQuote.component';

import {MatCardModule} from '@angular/material';
import { PaiementQuoteService} from './paiementQuote.service';
// import { PaiementService} from './paiement.service';
import { PaiementQuoteRouting} from './paiementQuoteRouting.module';
// import { MaterialModule } from '@angular/material';

import { ProductModule } from '../product/product.module';
// import { AutocompleteComponent } from '../autocomplete/autocomplete.component'

import {SharedModule } from '../shared/shared.module';
// import { SignaturePadModule } from 'angular2-signaturepad';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PaiementPipe } from './paiement.pipe';
import {MatExpansionModule} from '@angular/material';
import {MatRadioModule} from '@angular/material';
import {MatInputModule} from '@angular/material';

@NgModule({
  imports:      [
    // ProjectModule,
    // NgbModule,
    PaiementQuoteRouting,
    // CommonModule,
    // FormsModule,
    // MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    ProductModule,
    SharedModule,
    MatCheckboxModule,
    MatCardModule,
    MatExpansionModule,
    MatRadioModule,
    MatInputModule,
    MatDatepickerModule,
    // SignaturePadModule,
    // AutocompleteComponent,
  ],
  declarations: [
    PaiementQuotesComponent,
    EditPaiementQuoteComponent,
    PaiementQuoteDialogComponent,
    PaiementPipe,

    // AutocompleteComponent
  ],
  exports:      [
    PaiementQuotesComponent,
    EditPaiementQuoteComponent,
    // AutocompleteComponent,
  ],
  providers:    [
    PaiementQuoteService,
    // PaiementService
  ],
  entryComponents: [
    PaiementQuoteDialogComponent,
  ]
})
export class PaiementQuoteModule { }
