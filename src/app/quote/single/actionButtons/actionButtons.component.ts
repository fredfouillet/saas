import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';
import {QuoteService} from '../../quote.service';
// import {TemplateQuoteService} from '../templateQuote.service';

// import { DragulaService } from 'ng2-dragula';
// import {ProductService} from '../../product/product.service';
// import { ProjectService} from '../../project/project.service';

// import {Quote, DevisDetail, BucketProduct, StatusQuotes, StatusQuotesInvoice, Signature, PriceQuoteTaxe, ModelVATs } from '../quote.model';
import {Quote} from '../../quote.model';
// import {TemplateQuote } from '../../templateQuote.model';

import {ToastsManager} from 'ng2-toastr';
import {MatDialog } from '@angular/material';
// import {Router, ActivatedRoute, Params } from '@angular/router';
import {Router } from '@angular/router';
import { Location } from '@angular/common';
// import { FormBuilder, FormGroup, Validators} from '@angular/forms';
// import { UserService} from '../../user/user.service';
import { DeleteDialogComponent } from '../../../nav/deleteDialog/deleteDialog.component';

@Component({
  selector: 'app-actionButtons',
  templateUrl: './actionButtons.component.html',
  styleUrls: ['./actionButtons.component.css'],
})
export class ActionButtonsComponent implements OnInit {
  // @ViewChild(SignaturePad) signaturePad: SignaturePad;
  // @ViewChild(PaiementQuotesComponent) paiementQuotesComponent: PaiementQuotesComponent;

  // loading: boolean = false;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() closeDialog: EventEmitter<any> = new EventEmitter();
  @Output() nextStep: EventEmitter<any> = new EventEmitter();
  //
  // @Input() search: Search = new Search()
  //
  // showPaiements: boolean = false
  @Input() fetchedQuote: Quote = new Quote()
  @Input() showDeleteButton: boolean = true
  @Input() showSaveButton: boolean = true
  @Input() showSaveSignatureButton: boolean = false
  @Input() isDialog: boolean = false
  @Input() showDLQuoteButton: boolean = false
  @Input() step: number

  loading: boolean = false

  constructor(
    private quoteService: QuoteService,

    private toastr: ToastsManager,
    public dialog: MatDialog,
    // private activatedRoute: ActivatedRoute,
    private router: Router,
    // private location: Location,
    // private _fb: FormBuilder,
    public authService: AuthService,
    // private dragulaService: DragulaService,
    // private translateService: TranslateService,
  ) {

  }

  nextStepEmit() {
    if (this.fetchedQuote.statusQuote === 'pending') {
      this.save()
    }
    this.nextStep.emit(this.fetchedQuote)

  }

  close() {
    this.closeDialog.emit()
  }
  ngOnInit() {
  }

  saveSignature() {
    if(this.fetchedQuote.drawingSignature.base64Temp) {
      this.fetchedQuote.drawingSignature.base64 = this.fetchedQuote.drawingSignature.base64Temp
    }

      this.quoteService.updateSignature(this.fetchedQuote)
        .subscribe(
        res => {

          this.toastr.success('Great!', res.message)
          this.nextStep.emit(this.fetchedQuote)
        },
        error => { console.log(error) }
        )
  }

  save() {


    if (this.fetchedQuote._id) {
      this.quoteService.updateQuote(this.fetchedQuote)
        .subscribe(
        res => {
          this.toastr.success('Great!', res.message)
          // this.getQuote(res.obj._id)
          this.saved.emit(res)
          //this.router.navigate(['quote/edit/' + this.fetchedQuote._id])
        },
        error => {
          this.toastr.error('error!', error)
        }
        )
    } else {
      this.quoteService.saveQuote(this.fetchedQuote)
        .subscribe(
        res => {
          console.log(res)
          this.toastr.success('Great!', res.message)
          // this.router.navigate(['quote/' + res.obj._id])
          this.saved.emit(res)
        },
        error => { console.log(error) }
        )
    }
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


  onDelete(id: string) {
    let this2 = this
    return new Promise(function(resolve, reject) {
      this2.quoteService.deleteQuote(id)
        .subscribe(
        res => {
          this2.toastr.success('Great!', res.message);
          resolve(res)
        },
        error => {
          console.log(error);
          reject(error)
        }
        )
    })
  }


  openDialogDelete() {
    const this2 = this
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent)
    dialogRefDelete.afterClosed().subscribe(result => {
      if (result) {
        this.onDelete(this.fetchedQuote._id).then(function() {
          this2.router.navigate(['quote/list/quote']);
        })

      }
    })
  }



}
