import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
// import {AuthService} from '../../../auth/auth.service';
import {QuoteService} from '../../quote.service';
// import {TemplateQuoteService} from '../templateQuote.service';

// import { DragulaService } from 'ng2-dragula';
// import {ProductService} from '../../product/product.service';
// import { ProjectService} from '../../project/project.service';

// import {Quote, DevisDetail, BucketProduct, StatusQuotes, StatusQuotesInvoice, Signature, PriceQuoteTaxe, ModelVATs } from '../quote.model';
import {Quote} from '../../quote.model';
// import {TemplateQuote } from '../../templateQuote.model';

import {ToastsManager} from 'ng2-toastr';
// import {MatDialog } from '@angular/material';
// import {Router, ActivatedRoute, Params } from '@angular/router';
// import {Router } from '@angular/router';
import { Location } from '@angular/common';
// import { FormBuilder, FormGroup, Validators} from '@angular/forms';
// import { UserService} from '../../user/user.service';
// import { DeleteDialogComponent } from '../../../nav/deleteDialog/deleteDialog.component';
// import { User } from '../../user/user.model';
// import { Product } from '../../product/product.model';
// import { Project } from '../../project/project.model';
// import { PaiementQuote } from '../../paiementQuote/paiementQuote.model';
// import { PaiementQuoteDialogComponent } from '../paiementQuote/single/dialog/paiementQuoteDialog.component';
// import { PaiementQuoteDialogComponent } from '../../paiementQuote/single/dialog/paiementQuoteDialog.component'

// import { TranslateService } from '../../translate/translate.service';
// declare let jsPDF;
// import { SignaturePad } from 'angular2-signaturepad/signature-pad';
// import { SignaturePad } from '../../angular2-signaturepad/signature-pad';

// import { PaiementQuotesComponent } from '../../paiementQuote/paiementQuotes/paiementQuotes.component';
// import {Search} from '../../shared/shared.model'

@Component({
  selector: 'app-invoice-action',
  templateUrl: './invoiceAction.component.html',
  styleUrls: ['./invoiceAction.component.css'],
})
export class InvoiceActionComponent implements OnInit {

  @Input() fetchedQuote: Quote = new Quote()
  loading: boolean = false


  constructor(
    private quoteService: QuoteService,

    private toastr: ToastsManager,

  ) {

  }


    downloadPDF() {
      this.loading = true
      this.quoteService.downloadPDF(this.fetchedQuote._id)
        .subscribe(
          res => {
            console.log(res)
             window.open( '/uploads/pdf/' + res );
             this.loading = false
          },
          error => {
            this.loading = false
            console.log(error)
          }
        )
    }

    sendQuoteByEmailToClient() {
      this.loading = true
      this.quoteService.sendQuoteByEmailToClient(this.fetchedQuote._id)
        .subscribe(
          res => {
            // console.log(res)
            this.toastr.success('Great!', 'Mail envoyeé!')
            //  window.open( '/uploads/pdf/' + res );
             this.loading = false
          },
          error => {
            this.loading = false
            console.log(error)
          }
        )
    }

  ngOnInit() {

  }



}
