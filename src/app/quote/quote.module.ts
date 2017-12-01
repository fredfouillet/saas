import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule} from '@angular/router';

// import { RoundPipe} from './round.pipe';
// import { ProjectModule} from '../project/project.module';

import { QuoteDialogComponent } from './single/dialog/quoteDialog.component';



import { QuotesComponent} from './list/quotes.component';
import { QuoteComponent} from './single/quote.component';
import { ActionButtonsComponent} from './single/actionButtons/actionButtons.component';
import { QuoteInfoComponent} from './single/quoteInfo/quoteInfo.component';
// import { SignatureComponent} from './single/signature/signature.component';
import { QuoteDetailsComponent} from './single/quoteDetails/quoteDetails.component';
import { MobileDetailsComponent} from './single/quoteDetails/quoteDetailsElem/mobileDetails.component';
import { DesktopDetailsComponent} from './single/quoteDetails/quoteDetailsElem/desktopDetails.component';
import { TemplateQuoteComponent} from './single/quoteDetails/quoteDetailsElem/templateQuote.component';
import { TotalComponent} from './single/quoteDetails/quoteDetailsElem/total.component';
import { EditQuoteComponent} from './single/editQuote/editQuote.component';
import { AddTextRowComponent} from './single/editQuote/addTextRow.component';
// import { QuoteDetailComponent} from './single/quoteDetail.component';
import { QuoteService} from './quote.service';
import { TemplateQuoteService} from './templateQuote.service';
import { QuoteRouting} from './quoteRouting.module';
// import { MaterialModule } from '@angular/material';
import {MatCardModule} from '@angular/material';
import { ProductModule } from '../product/product.module';
// import { AutocompleteComponent } from '../autocomplete/autocomplete.component'

import { SharedModule } from '../shared/shared.module';
import {MatButtonModule} from '@angular/material';
// import { SignaturePadModule } from '../angular2-signaturepad';
// import { SignaturePad } from '../angular2-signaturepad/signature-pad';
//
import { DrawingModule } from './single/drawing/drawing.module';
import { DrawinSignaturegModule } from './single/drawingSignature/drawingSignature.module';



import { PaiementQuoteModule} from '../paiementQuote/paiementQuote.module'
// import { CKEditorModule } from 'ng2-ckeditor';

import { DragulaModule } from 'ng2-dragula';

// import { QuillModule } from 'ngx-quill'

import { QuillEditorModule } from 'ngx-quill-editor';

import {MatDatepickerModule} from '@angular/material';
import {MatNativeDateModule} from '@angular/material';
import {MatSelectModule} from '@angular/material';
// import {MatFormFieldModule} from '@angular/material';
// import {MatInputModule} from '@angular/material';
// import {MatExpansionModule} from '@angular/material';
// import {MatIconModule} from '@angular/material';

import {MatTabsModule} from '@angular/material';

@NgModule({
  imports:      [
    QuillEditorModule,
    // ProjectModule,
    // QuillModule,
    QuoteRouting,
    CommonModule,
    FormsModule,
    // MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    ProductModule,
    SharedModule,
    // SignaturePadModule,
    PaiementQuoteModule,
    MatButtonModule,

    // MatFormFieldModule,
    // MatInputModule,
    // CKEditorModule,
    DragulaModule,
    DrawingModule,
    DrawinSignaturegModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    // MatExpansionModule,
    // MatIconModule,
    MatCardModule,
    MatSelectModule,
    // AutocompleteComponent,
  ],
  declarations: [
    QuotesComponent,
    QuoteComponent,
    // SignatureComponent,
    QuoteDetailsComponent,
    MobileDetailsComponent,
    DesktopDetailsComponent,
    TemplateQuoteComponent,
    TotalComponent,
    EditQuoteComponent,
    AddTextRowComponent,
    QuoteDialogComponent,
    QuoteInfoComponent,
    ActionButtonsComponent,
    // QuoteDetailComponent,
    // RoundPipe,
    // AutocompleteComponent
  ],
  exports:      [
    QuotesComponent,
    // AutocompleteComponent,
  ],
  providers:    [
    QuoteService,
    TemplateQuoteService
  ],
  entryComponents: [
    QuoteDialogComponent,
  ]
})
export class QuoteModule { }
