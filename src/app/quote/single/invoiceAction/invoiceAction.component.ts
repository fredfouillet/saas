import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {QuoteService} from '../../quote.service';
import {Quote} from '../../quote.model';

import {ToastsManager} from 'ng2-toastr';
import { Location } from '@angular/common';

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
