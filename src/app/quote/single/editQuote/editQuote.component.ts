import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';
import {QuoteService} from '../../quote.service';
import {TemplateQuoteService} from '../../templateQuote.service';

import { DragulaService } from 'ng2-dragula';
import {ProductService} from '../../../product/product.service';
// import { ProjectService} from '../../../project/project.service';

import {Quote, DevisDetail,
  BucketProduct,
  StatusQuotes, StatusQuotesInvoice,
  PriceQuoteTaxe, ModelVATs } from '../../quote.model';
import {TemplateQuote } from '../../templateQuote.model';

import {ToastsManager} from 'ng2-toastr';
import {MatDialog } from '@angular/material';
import {Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UserService} from '../../../user/user.service';
// import { DeleteDialog } from '../../../deleteDialog/deleteDialog.component';
import { User } from '../../../user/user.model';
import { Product } from '../../../product/product.model';
// import { Project } from '../../../project/project.model';
import { PaiementQuote } from '../../../paiementQuote/paiementQuote.model';
// import { PaiementQuoteDialogComponent } from '../../paiementQuote/single/dialog/paiementQuoteDialog.component';
// import { PaiementQuoteDialogComponent } from '../../../paiementQuote/single/dialog/paiementQuoteDialog.component'

import { TranslateService } from '../../../translate/translate.service';
// declare let jsPDF;
// import { SignaturePad } from 'angular2-signaturepad/signature-pad';
// import { SignaturePad } from '../../../angular2-signaturepad/signature-pad';

import { PaiementQuotesComponent } from '../../../paiementQuote/paiementQuotes/paiementQuotes.component';
import {Search} from '../../../shared/shared.model'

@Component({
  selector: 'app-edit-quote',
  templateUrl: './editQuote.component.html',
  styleUrls: ['../../quote.component.css'],
})
export class EditQuoteComponent implements OnInit {
  loading: boolean = false;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() calculateQuote: EventEmitter<any> = new EventEmitter();

  @Input() search: Search = new Search()

  showPaiements: boolean = false
  @Input() fetchedQuote: Quote = new Quote()
  fetchedProducts: Product[] = []
  fetchedPaiementQuotes: PaiementQuote[] = []
  statusQuotes = StatusQuotes
  statusQuotesInvoice = StatusQuotesInvoice
  totalPaiementAmount: number = 0
  myForm: FormGroup;

  constructor(
    private quoteService: QuoteService,
    private toastr: ToastsManager,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    // private location: Location,
    private _fb: FormBuilder,
    public authService: AuthService,
    // private dragulaService: DragulaService,
    private translateService: TranslateService,
  ) {
  }

  changeStatutsQuote(statusQuoteSelect){
    console.log(statusQuoteSelect)
  }

  ngOnInit() {

    this.myForm = this._fb.group({
      name: [''],
      quoteNumber: [''],
      statusQuote: [''],
      issueDate: [''],
      currency: ['', [Validators.required, Validators.minLength(1)]],
      quoteRef: ['', [Validators.required, Validators.minLength(1)]],

    })
  }

  addProductToQuote(product: Product) {
      const bucketProduct: BucketProduct = new BucketProduct()
      bucketProduct.typeRow = 'product'
      bucketProduct.productInit = [product]
      bucketProduct.vat = product.details.price.vat
      bucketProduct.priceWithoutTaxes = product.details.price.sellingPrice
      bucketProduct.priceWithTaxes = 0
      bucketProduct.priceWithTaxesWithQuantity = 0
      bucketProduct.priceWithQuantity = 0
      bucketProduct.quantity = 1
      bucketProduct.discount = 0

      const newDevisDetail: DevisDetail = new DevisDetail();
      newDevisDetail.bucketProducts.push(bucketProduct)
      this.fetchedQuote.devisDetails.push(newDevisDetail)
      this.calculateQuote.emit()
  }
  addTextToQuote(textToQuote) {
    const bucketProduct: BucketProduct = new BucketProduct()
    bucketProduct.typeRow = 'text'
    bucketProduct.title = textToQuote.title
    bucketProduct.priceWithoutTaxes = textToQuote.priceWithoutTaxes
    // textToQuote
    // bucketProduct.priceWithTaxes = 0
    // bucketProduct.priceWithTaxesWithQuantity = 0
    // bucketProduct.priceWithQuantity = 0
    // bucketProduct.quantity = 1
    // bucketProduct.discount = 0

    const newDevisDetail: DevisDetail = new DevisDetail();
    newDevisDetail.bucketProducts.push(bucketProduct)
    this.fetchedQuote.devisDetails.push(newDevisDetail)
    this.calculateQuote.emit()

  }

  quoteDetailsUpdated(result) {
    // console.log(result)
    this.fetchedQuote = result
  }
  togglePaiements() {
    this.showPaiements = !this.showPaiements
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
        error => { console.log(error) }
      )
  }

  // sendQuoteByEmailToClient() {
  //   this.loading = true
  //   this.quoteService.sendQuoteByEmailToClient(this.fetchedQuote._id)
  //     .subscribe(
  //       res => {
  //         // console.log(res)
  //         this.toastr.success('Great!', 'Mail envoyeé!')
  //         //  window.open( '/uploads/pdf/' + res );
  //          this.loading = false
  //       },
  //       error => { console.log(error) }
  //     )
  // }

  // save(){}


}
