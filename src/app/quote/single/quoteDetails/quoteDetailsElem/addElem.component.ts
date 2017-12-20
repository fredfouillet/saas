import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
// import { AuthService } from '../../../auth/auth.service';
import { QuoteService } from '../../../quote.service';
// import { TemplateQuoteService } from '../../templateQuote.service';

// import { ProductService } from '../../../product/product.service';
// import { ProjectService} from '../../../project/project.service';
import { ProductsDialogComponent } from '../../../../product/products/dialog/productsDialog.component';
import { MatDialog } from '@angular/material';
import {
  Quote, DevisDetail, BucketProduct, StatusQuotes,
  // PriceQuoteTaxe,
  // ModelVATs
} from '../../../quote.model';
// import { TemplateQuote } from '../../templateQuote.model';

import { ToastsManager } from 'ng2-toastr';
// import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { UserService } from '../../../user/user.service';
// import { DeleteDialog } from '../../../deleteDialog/deleteDialog.component';
// import { User } from '../../../user/user.model';
import { Product } from '../../../../product/product.model';
// import { Project } from '../../../project/project.model';
// import { PaiementQuote } from '../../../paiementQuote/paiementQuote.model';
// import { PaiementQuoteDialogComponent } from '../paiementQuote/single/dialog/paiementQuoteDialog.component';
// import { PaiementQuoteDialogComponent } from '../../../paiementQuote/single/dialog/paiementQuoteDialog.component'

// import { TranslateService } from '../../../translate/translate.service';
// declare let jsPDF;
// import { SignaturePad } from 'angular2-signaturepad/signature-pad';
// import { SignaturePad } from '../../../angular2-signaturepad/signature-pad';

// import { PaiementQuotesComponent } from '../../../paiementQuote/paiementQuotes/paiementQuotes.component';
import { Search } from '../../../../shared/shared.model'

@Component({
  selector: 'app-add-elem',
  templateUrl: './addElem.component.html',
  styleUrls: ['../quoteDetails.component.css'],
})
export class AddElemComponent implements OnInit {
  // @ViewChild(SignaturePad) signaturePad: SignaturePad;
  // @ViewChild(PaiementQuotesComponent) paiementQuotesComponent: PaiementQuotesComponent;

  // loading: boolean=false;
  // @Output() saved: EventEmitter<any> = new EventEmitter();
  // @Output() quoteDetailsUpdated: EventEmitter<any> = new EventEmitter();
  @Output() calculateQuoteEmit: EventEmitter<any> = new EventEmitter();

  @Input() fetchedQuote: Quote = new Quote()
  // @Input() search: Search = new Search()
  //
  // // showPaiements: boolean = false
  // // fetchedQuote: Quote = new Quote()
  // // autocompleteUser: string = '';
  // // autocompleteProject: string = '';
  // fetchedProducts: Product[] = []

  // imgLogoUrl: string = './assets/images/profile-placeholder.jpg'
  // imgSignatureBase64Temp = ''
  // fetchedPaiementQuotes: PaiementQuote[] = []
  statusQuotes = StatusQuotes


  constructor(
    private quoteService: QuoteService,
    public dialog: MatDialog,
    // private templateQuoteService: TemplateQuoteService,
    // private projectService: ProjectService,
    // private userService: UserService,
    // private productService: ProductService,
    //    private modalService: NgbModal,
    private toastr: ToastsManager,
    // public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private _fb: FormBuilder,
    // public authService: AuthService,
    // private translateService: TranslateService,
  ) {


  }




  ngOnInit() {

  }

  addBucketProducts() {
    const newDevisDetail = new DevisDetail()
    this.fetchedQuote.devisDetails.push(newDevisDetail)
  }



    addRow(typeRow) {
      if (typeRow) {
        if (typeRow === 'category')
          this.addBucketProducts()

        if (!this.fetchedQuote.devisDetails.length)
          this.addBucketProducts()

        if (typeRow === 'product' || typeRow === 'text') {
          let bucketProduct: BucketProduct = new BucketProduct()
          bucketProduct.isEditMode = true
          bucketProduct.typeRow = typeRow
          this.fetchedQuote.devisDetails[this.fetchedQuote.devisDetails.length - 1].bucketProducts.push(bucketProduct)
          this.calculateQuote()
        }
      }
    }

    calculateQuote() {
      this.calculateQuoteEmit.emit()
    }

    addRowMobile () {
        const this2 = this
        const dialogRefProducts = this.dialog.open(ProductsDialogComponent)
        const sub = dialogRefProducts.componentInstance.onAdd.subscribe((product) => {
          this.addProductToQuote(product)
          // do something
        });
        dialogRefProducts.afterClosed().subscribe(result => {
          if (result) {
            // this.onDelete(this.fetchedProduct._id).then(function() {
            //   this2.router.navigate(['product']);
            // })
          }
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
            this.calculateQuote();
        }

}
