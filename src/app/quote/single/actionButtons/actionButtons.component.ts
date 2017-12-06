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
  @Input() step: number
  // autocompleteUser: string = '';
  // autocompleteProject: string = '';
  // fetchedProducts: Product[] = []
  //
  // // imgLogoUrl: string = './assets/images/profile-placeholder.jpg'
  // // imgSignatureBase64Temp = ''
  // fetchedPaiementQuotes: PaiementQuote[] = []
  // statusQuotes = StatusQuotes
  // statusQuotesInvoice = StatusQuotesInvoice
  // totalPaiementAmount: number = 0
  // myForm: FormGroup;


  // private signaturePadOptions = { // passed through to szimek/signature_pad constructor
  //   minWidth: 1,
  //   maxWidth: 4,
  //   canvasWidth: 250,
  //   canvasHeight: 200,
  //   penColor: "rgb(36, 41, 46)"
  // };

  //
  // step = 0;
  //
  // setStep(index: number) {
  //   this.step = index;
  // }

  // public editorOptions = {
  //   placeholder: "insert content...",
  //   modules: {
  //     // toolbar: [['bold', 'italic'], ['link', 'image']] // see https://quilljs.com/docs/formats/
  //   }
  // };

  // autocompleteProduct: String = ''
  // fetchedUsers: User[] = [];
  // arrayContentToSearch = []
  // ckeditorContent=''
  // ckeConfig: any;

  // VATs = ModelVATs
  // rowTypes = [
  //   { label: 'Category', value: 'category' },
  //   { label: 'Product', value: 'product' },
  //   { label: 'Text', value: 'text' },
  //
  // ]
  constructor(
    private quoteService: QuoteService,
    // private templateQuoteService: TemplateQuoteService,
    // private projectService: ProjectService,
    // private userService: UserService,
    // private productService: ProductService,
    //    private modalService: NgbModal,
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
    // dragulaService.setOptions('third-bag', {
    //   removeOnSpill: true
    // });


    // const bag: any = this.dragulaService.find('third-bag');
    // if (bag !== undefined ) this.dragulaService.destroy('third-bag');
    // // this.dragulaService.setOptions('third-bag', { revertOnSpill: true });
    //

    // dragulaService.setOptions('third-bag', {
    //   moves: function (el, container, handle) {
    //     return (handle.className === 'fa fa-arrows handle' || handle.className === 'btn btn-sm handle');
    //   }
    // });
  }

  nextStepEmit() {
    this.save()
    this.nextStep.emit(this.fetchedQuote)
    // this.step++;
    // console.log(this.step)
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

    // this.fetchedQuote.historyClients = this.fetchedQuote.clients
    // if(this.fetchedQuote.drawingSignature.base64Temp)
    //   this.fetchedQuote.drawingSignature.base64 = this.fetchedQuote.drawingSignature.base64Temp
    // this.fetchedQuote.detail.dateQuote.issueDate = this.authService.HTMLDatetoIsoDate(this.fetchedQuote.detail.dateQuote.issueDateString)
    // this.fetchedQuote.detail.dateQuote.expiryDate = this.authService.HTMLDatetoIsoDate(this.fetchedQuote.detail.dateQuote.expiryDateString)
    // this.fetchedQuote.detail.dateQuote.dateInvoicePaid = this.authService.HTMLDatetoIsoDate(this.fetchedQuote.detail.dateQuote.dateInvoicePaidString)

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


  //
  // removeBucketProducts(i) {
  //   this.fetchedQuote.devisDetails.splice(i, 1);
  //   this.calculateQuote()
  // }
  // addBucketProducts() {
  //   let newDevisDetail = new DevisDetail()
  //   this.fetchedQuote.devisDetails.push(newDevisDetail)
  // }
  //
  //
  // selectTemplateQuote(templateQuote: TemplateQuote) {
  //   this.arrayContentToSearch = []
  //   templateQuote.devisDetails.forEach(devisDetail => {
  //     this.fetchedQuote.devisDetails.push(devisDetail)
  //   })
  //
  //   this.calculateQuote()
  // }
  // selectProduct(product: Product, i, j) {
  //
  //   // let bucketProduct: BucketProduct = new BucketProduct()
  //
  //   this.fetchedQuote.devisDetails[i].bucketProducts[j].productInit = [product],
  //     this.fetchedQuote.devisDetails[i].bucketProducts[j].vat = product.details.price.vat,
  //     this.fetchedQuote.devisDetails[i].bucketProducts[j].priceWithoutTaxes = product.details.price.sellingPrice,
  //     this.fetchedQuote.devisDetails[i].bucketProducts[j].priceWithTaxes = 0,
  //     this.fetchedQuote.devisDetails[i].bucketProducts[j].priceWithTaxesWithQuantity = 0,
  //     this.fetchedQuote.devisDetails[i].bucketProducts[j].priceWithQuantity = 0,
  //     this.fetchedQuote.devisDetails[i].bucketProducts[j].quantity = 1,
  //     this.fetchedQuote.devisDetails[i].bucketProducts[j].discount = 0,
  //
  //     // this.autocompleteProduct = ''
  //
  //     // this.fetchedQuote.devisDetails[i].bucketProducts.push(bucketProduct)
  //     this.calculateQuote()
  // }
  // calculateQuote() {
  //   let this2 = this;
  //   setTimeout(function() {
  //     this2.fetchedQuote.priceQuote.priceQuoteWithTaxes = 0
  //     this2.fetchedQuote.priceQuote.priceQuoteWithoutTaxes = 0
  //
  //     this2.fetchedQuote.priceQuote.priceQuoteTaxes = []
  //     this2.VATs.forEach(VAT => {
  //       let newPriceQuoteTaxe = new PriceQuoteTaxe()
  //       newPriceQuoteTaxe.VAT = VAT
  //       this2.fetchedQuote.priceQuote.priceQuoteTaxes.push(newPriceQuoteTaxe)
  //     })
  //
  //     this2.fetchedQuote.devisDetails.forEach((devisDetails, i) => {
  //       this2.fetchedQuote.devisDetails[i].bucketProducts.forEach((product, j) => {
  //         this2.fetchedQuote.devisDetails[i].bucketProducts[j].priceWithTaxes = product.priceWithoutTaxes * 1 + (product.priceWithoutTaxes * product.vat / 100)
  //         this2.fetchedQuote.devisDetails[i].bucketProducts[j].priceWithTaxesWithQuantity = this2.fetchedQuote.devisDetails[i].bucketProducts[j].priceWithTaxes * product.quantity
  //         this2.fetchedQuote.devisDetails[i].bucketProducts[j].priceWithQuantity = product.priceWithoutTaxes * product.quantity
  //
  //         this2.fetchedQuote.priceQuote.priceQuoteWithTaxes = this2.fetchedQuote.priceQuote.priceQuoteWithTaxes * 1 + this2.fetchedQuote.devisDetails[i].bucketProducts[j].priceWithTaxesWithQuantity * 1
  //         this2.fetchedQuote.priceQuote.priceQuoteWithoutTaxes = this2.fetchedQuote.priceQuote.priceQuoteWithoutTaxes * 1 + this2.fetchedQuote.devisDetails[i].bucketProducts[j].priceWithQuantity * 1
  //
  //
  //         this2.fetchedQuote.priceQuote.priceQuoteTaxes.forEach((priceQuoteTaxe, i) => {
  //           if(priceQuoteTaxe.VAT === product.vat) {
  //             this2.fetchedQuote.priceQuote.priceQuoteTaxes[i].TotalVAT += (product.priceWithoutTaxes * product.vat / 100) * product.quantity
  //           }
  //         })
  //
  //
  //       })
  //     })
  //
  //
  //
  //     //this2.save()
  //   }, 20)
  //
  // }
  // removeRow(i: number, j: number) {
  //   this.fetchedQuote.devisDetails[i].bucketProducts.splice(j, 1);
  //   this.calculateQuote()
  // }

  // editRaw(i: number, j: number) {
  //   this.fetchedQuote.devisDetails[i].bucketProducts[j].isRawEditModer = true;
  //   // this.calculateQuote()
  // }

  //   parseDate(dateString: string): Date {
  //     if (dateString) {
  //         return new Date(dateString);
  //     } else {
  //         return null;
  //     }
  // }

  // removePaiement(i: number) {
  //   this.fetchedQuote.paiements.splice(i, 1);
  //   this.calculateQuote()
  // }

  // getProducts(page: number, search: any) {
  //   this.productService.getProducts(page, search)
  //     .subscribe(
  //     res => {
  //       this.fetchedProducts = res.data
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //     );
  // }

  //
  // saveTemplateQuote(nameTemplate: string) {
  //   let newTemplateQuote = new TemplateQuote()
  //   newTemplateQuote.nameTemplate = nameTemplate
  //
  //   newTemplateQuote.devisDetails = this.fetchedQuote.devisDetails
  //   this.templateQuoteService.saveTemplateQuote(newTemplateQuote)
  //     .subscribe(
  //     res => {
  //       this.toastr.success('Great!', res.message)
  //     },
  //     error => { console.log(error) }
  //     )
  // }

  // move(i: number, incremet: number, typeUser: string) {
  //   if(i>=0 && i<=this[typeUser].length + incremet) {
  //     var tmp = this[typeUser][i];
  //     this[typeUser][i] = this[typeUser][i + incremet]
  //     this[typeUser][i + incremet] = tmp
  //     this.save()
  //   }
  // }




  // goBack() {
  //   this.location.back();
  // }

  // addUser(user) {
  //   const control = <FormArray>this.myForm.controls['_users'];
  //   const addrCtrl = this._fb.group({
  //       _id: ['', Validators.required],
  //   });
  //   control.push(addrCtrl);
  // }




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
  // newPaiementQuoteSaved() {
  //   this.paiementQuotesComponent.getPaiementQuotesInit()
  //   // this.refreshPaiementQuotes.emit()
  //   // this.getPaiementQuotesCross.emit(this.fetchedPaiementQuotes)
  // }
  // getPaiementQuotes(event) {
  //   // console.log(event)
  //   this.totalPaiementAmount = 0
  //   this.fetchedPaiementQuotes = event
  //   this.fetchedPaiementQuotes.forEach(paiement => {
  //     this.totalPaiementAmount += paiement.amount
  //   })
  // }
  // getQuote(id: string) {
  //   this.quoteService.getQuote(id)
  //     .subscribe(
  //     res => {
  //       this.fetchedQuote = res
  //       this.fetchedQuote.detail.dateQuote.issueDateString = this.authService.isoDateToHtmlDate(this.fetchedQuote.detail.dateQuote.issueDate)
  //       this.fetchedQuote.detail.dateQuote.expiryDateString = this.authService.isoDateToHtmlDate(this.fetchedQuote.detail.dateQuote.expiryDate)
  //       this.fetchedQuote.detail.dateQuote.dateInvoicePaidString = this.authService.isoDateToHtmlDate(this.fetchedQuote.detail.dateQuote.dateInvoicePaid)
  //
  //       this.fetchedQuote.projects.forEach(project => { this.search.projectId = project._id })
  //       this.fetchedQuote.clients.forEach(user => { this.search.userId = user._id })
  //
  //
  //     },
  //     error => { console.log(error) }
  //     )
  // }

  // isAdmin() {
  //   return this.authService.isAdmin();
  // }



}
