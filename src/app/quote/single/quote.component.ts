import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { QuoteService } from '../quote.service';
import { Quote, PriceQuoteTaxe, ModelVATs } from '../quote.model';
import { ActivatedRoute, Params } from '@angular/router';
// import { FormBuilder, Validators } from '@angular/forms';
// import { ActionButtonsComponent } from './actionButtons/actionButtons.component';
// import { TranslateService } from '../../translate/translate.service';
import { Search } from '../../shared/shared.model';
import { PaiementQuote } from '../../paiementQuote/paiementQuote.model';
import { DrawingSignatureComponent } from './drawingSignature/drawingSignature.component';
import {ToastsManager} from 'ng2-toastr';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['../quote.component.css'],
})
export class QuoteComponent implements OnInit {
  // @ViewChild(SignaturePad) signaturePad: SignaturePad;
  // @ViewChild(PaiementQuotesComponent) paiementQuotesComponent: PaiementQuotesComponent;
  // @ViewChild(ActionButtonsComponent) actionButtonsComponent: ActionButtonsComponent
  @ViewChild(DrawingSignatureComponent) drawingSignatureComponent: DrawingSignatureComponent
  loading: boolean = false;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() search: Search = new Search()
  @Input() isDialog: boolean = false

  fetchedPaiementQuotes: PaiementQuote[] = []
  // showPaiements: boolean = false
  fetchedQuote: Quote = new Quote()
  totalPaiementAmount: number = 0
  signatureBase64Temp: string = ''
  step = 0;


  VATs = ModelVATs


  setStep(index: number) {
    this.step = index;
  }

  constructor(
    private quoteService: QuoteService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private toastr: ToastsManager,
    // private router: Router,
    // private location: Location,
    // private _fb: FormBuilder,
    // private dragulaService: DragulaService,
    // private translateService: TranslateService,
  ) {
  }



  nextStep() {
    this.step++;
    this.save()

  }
  clearDrawing() {
    this.drawingSignatureComponent.clearDrawing();
    // this.saveSignature()
  }
  // clearedDrawing() {
  //   this.fetchedQuote.drawingSignature.base64 = ''
  //   this.fetchedQuote.drawingSignature.base64Temp = ''
  //   this.fetchedQuote.statusQuote = 'pending'
  //   this.actionButtonsComponent.saveSignature()
  // }
  buttonSaved(quote: Quote) {
    this.getQuote(quote._id)
    this.nextStep()
  }
  closeDialog() {
    this.close.emit()
  }
  getMaxQuoteNumber() {
    this.quoteService.maxQuoteNumber()
      .subscribe(
      res => {
        this.fetchedQuote.quoteNumber = res
      },
      error => { console.log(error) }
      )
  }

  getQuote(id: string) {
    this.loading = true
    const this2 = this
    return new Promise(function(resolve, reject) {
      this2.quoteService.getQuote(id)
        .subscribe(
        res => {
          this2.loading = false
          this2.fetchedQuote = res
          this2.fetchedQuote.clients.forEach(user => { this2.search.userId = user._id })
          resolve(this2.fetchedQuote)
        },
        error => {
          this.loading = false
          // console.log(error)
          reject(error)
        }
        )
    })
  }


  ngOnInit() {



    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['idQuote']) {
        this.search.quoteId = params['idQuote']
        this.getQuote(params['idQuote']).then(quote => {
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.getMaxQuoteNumber()
        if (params['userId']) {
          this.search.userId = params['userId']
        }
      }
      // else if (params['parentQuoteId']) {
      //   // this.getQuote(params['parentQuoteId']).then((parentQuote: Quote) => {
      //   //   this.search.parentQuoteId = params['parentQuoteId']
      //   //   this.fetchedQuote._id = ''
      //   //   this.fetchedQuote.typeQuote = 'invoice'
      //   //   this.fetchedQuote.drawingSignature.isSigned = false
      //   //   this.fetchedQuote.quoteNumber = null
      //   //   this.getMaxQuoteNumber()
      //   // })
      // }

    })



    // if (this.search.parentQuoteId) {
    //   this.getQuote(this.search.parentQuoteId).then((parentQuote: Quote) => {
    //     this.fetchedQuote._id = ''
    //     this.fetchedQuote.typeQuote = 'invoice'
    //     this.fetchedQuote.quoteNumber = null
    //     this.getMaxQuoteNumber()
    //
    //   })
    // } else {
    //   // this.fetchedQuote.typeQuote = this.search.typeQuote
    //   this.activatedRoute.params.subscribe((params: Params) => {
    //     if (params['idQuote']) {
    //       this.search.quoteId = params['idQuote']
    //       this.getQuote(params['idQuote'])
    //     } else {
    //       this.getMaxQuoteNumber()
    //     }
    //   })
    // }
  }

  drawingSignatureUpdated(result) {
    // this.fetchedQuote.drawingSignature.isSigned = true
    this.fetchedQuote.drawingSignature.base64Temp = result

    // this.actionButtonsComponent.save()
  }
  // drawingUpdated(result) {
  //   this.fetchedQuote.drawing.base64 = result
  //   // this.actionButtonsComponent.save()
  // }

  saveSignature() {
    this.fetchedQuote.statusQuote = 'signed'
    if(this.fetchedQuote.drawingSignature.base64Temp) {
      this.fetchedQuote.drawingSignature.base64 = this.fetchedQuote.drawingSignature.base64Temp
    }

      this.quoteService.updateSignature(this.fetchedQuote)
        .subscribe(
        res => {
          this.fetchedQuote = res.obj
          this.toastr.success('Great!', res.message)
          // this.nextStep.emit(this.fetchedQuote)
          this.nextStep()
        },
        error => { console.log(error) }
        )
  }


  savedQuote(result) {
    this.getQuote(result.obj._id)
  }
  quoteDetailsUpdated() {

  }
  getPaiementQuotes(event) {
    // console.log(event)
    this.totalPaiementAmount = 0
    this.fetchedPaiementQuotes = event
    this.fetchedPaiementQuotes.forEach(paiement => {
      this.totalPaiementAmount += paiement.amount
    })


    if(
      this.totalPaiementAmount >= this.fetchedQuote.priceQuote.priceQuoteWithoutTaxes &&
      this.fetchedQuote.priceQuote.priceQuoteWithoutTaxes &&
      this.fetchedQuote.statusQuote !== 'paid' ) {
        this.fetchedQuote.statusQuote = 'paid'
        this.save()
    }
  }

  save() {
    if (this.fetchedQuote._id) {
      this.quoteService.updateQuote(this.fetchedQuote)
        .subscribe(
        res => {
          this.toastr.success('Great!', res.message)
          this.fetchedQuote = res.obj
          // this.getQuote(res.obj._id)
          // this.saved.emit(res)
        },
        error => {
          this.toastr.error('error!', error)
        }
        )
    } else {
      this.quoteService.saveQuote(this.fetchedQuote)
        .subscribe(
        res => {
          this.toastr.success('Great!', res.message)
          this.fetchedQuote = res.obj
          // this.getQuote(res.obj._id)
          // this.router.navigate(['quote/' + res.obj._id])
          // this.saved.emit(res)
        },
        error => { console.log(error) }
        )
    }
  }
  calculateQuote() {
    let this2 = this;
    setTimeout(() => {
      this2.fetchedQuote.priceQuote.priceQuoteWithTaxes = 0
      this2.fetchedQuote.priceQuote.priceQuoteWithoutTaxes = 0
      this2.fetchedQuote.priceQuote.priceQuoteWithoutTaxes = 0
      this2.fetchedQuote.priceQuote.priceGlobalWithDiscountWithSurface = 0
      this2.fetchedQuote.priceQuote.priceGlobalWithDiscountWithSurfaceWithPainfulness = 0
      this2.fetchedQuote.priceQuote.priceGlobalWithTaxesWithDiscountWithSurfaceWithPainfulness = 0

      this2.fetchedQuote.priceQuote.priceQuoteTaxes = []
      this2.VATs.forEach(VAT => {
        const newPriceQuoteTaxe = new PriceQuoteTaxe()
        newPriceQuoteTaxe.VAT = VAT
        this2.fetchedQuote.priceQuote.priceQuoteTaxes.push(newPriceQuoteTaxe)
      })

      this2.fetchedQuote.devisDetails.forEach((devisDetails, i) => {
        this2.fetchedQuote.devisDetails[i].bucketProducts.forEach((product, j) => {

          this2.fetchedQuote.devisDetails[i].bucketProducts[j]
            .surface = this2.fetchedQuote.devisDetails[i].bucketProducts[j]
              .width * this2.fetchedQuote.devisDetails[i].bucketProducts[j]
              .length


          this2.fetchedQuote.devisDetails[i].bucketProducts[j]
            .priceWithoutTaxesWithDiscount = product.priceWithoutTaxes
            * (1 - this2.fetchedQuote.devisDetails[i].bucketProducts[j].discount / 100)

          this2.fetchedQuote.devisDetails[i].bucketProducts[j]
            .priceWithTaxes = this2.fetchedQuote.devisDetails[i].bucketProducts[j]
              .priceWithoutTaxes * (1 + this2.fetchedQuote.devisDetails[i].bucketProducts[j].vat / 100)

          this2.fetchedQuote.devisDetails[i].bucketProducts[j]
            .priceWithTaxesWithDiscount = this2.fetchedQuote.devisDetails[i].bucketProducts[j]
              .priceWithTaxes * (1 - this2.fetchedQuote.devisDetails[i].bucketProducts[j].discount / 100)

          this2.fetchedQuote.devisDetails[i].bucketProducts[j]
            .priceWithTaxesWithQuantity = this2.fetchedQuote.devisDetails[i].bucketProducts[j]
              .priceWithTaxes * this2.fetchedQuote.devisDetails[i].bucketProducts[j].quantity

          this2.fetchedQuote.devisDetails[i].bucketProducts[j]
            .priceWithTaxesWithQuantityWithDiscount = this2.fetchedQuote.devisDetails[i].bucketProducts[j]
              .priceWithTaxesWithQuantity
            * (1 - this2.fetchedQuote.devisDetails[i].bucketProducts[j].discount / 100)



          this2.fetchedQuote.devisDetails[i].bucketProducts[j]
            .priceWithQuantity = this2.fetchedQuote.devisDetails[i].bucketProducts[j]
              .priceWithoutTaxes * this2.fetchedQuote.devisDetails[i].bucketProducts[j].quantity


          this2.fetchedQuote.devisDetails[i].bucketProducts[j]
            .priceWithQuantityWithDiscount = this2.fetchedQuote.devisDetails[i].bucketProducts[j]
              .priceWithQuantity * (1 - this2.fetchedQuote.devisDetails[i].bucketProducts[j]
                .discount / 100)


          this2.fetchedQuote.devisDetails[i].bucketProducts[j]
            .priceWithQuantityWithDiscountWithSurface = this2.fetchedQuote.devisDetails[i].bucketProducts[j]
              .priceWithQuantityWithDiscount * this2.fetchedQuote.devisDetails[i].bucketProducts[j].surface

          this2.fetchedQuote.devisDetails[i].bucketProducts[j]
            .priceWithTaxesWithQuantityWithDiscountWithSurface = this2.fetchedQuote.devisDetails[i].bucketProducts[j]
              .priceWithQuantityWithDiscountWithSurface * (1 - this2.fetchedQuote.devisDetails[i].bucketProducts[j].vat / 100)


          this2.fetchedQuote.priceQuote
            .priceQuoteWithTaxes += this2.fetchedQuote.devisDetails[i].bucketProducts[j]
              .priceWithTaxesWithQuantityWithDiscountWithSurface * 1


          this2.fetchedQuote.priceQuote
            .priceQuoteWithoutTaxes += this2.fetchedQuote.devisDetails[i].bucketProducts[j]
              .priceWithQuantityWithDiscountWithSurface * 1


          this2.fetchedQuote.priceQuote
            .priceGlobalWithDiscountWithSurface = this2.fetchedQuote.priceQuote
              .priceQuoteWithoutTaxes
            * (1 - this2.fetchedQuote.priceQuote.discountGlobal / 100)

          this2.fetchedQuote.priceQuote
            .priceGlobalWithDiscountWithSurfaceWithPainfulness = this2.fetchedQuote.priceQuote
              .priceGlobalWithDiscountWithSurface * (1 + this2.fetchedQuote.priceQuote.painfulnessGlobal / 100)

          this2.fetchedQuote.priceQuote
            .priceGlobalWithTaxesWithDiscountWithSurfaceWithPainfulness = this2.fetchedQuote.priceQuote
              .priceGlobalWithDiscountWithSurfaceWithPainfulness * (1 + this2.fetchedQuote.priceQuote.vatGlobal / 100)

          this2.fetchedQuote.priceQuote.priceQuoteTaxes.forEach((priceQuoteTaxe, i) => {
            if (priceQuoteTaxe.VAT === product.vat) {
              this2.fetchedQuote.priceQuote.priceQuoteTaxes[i]
                .TotalVAT += (product.priceWithoutTaxesWithDiscount * product.vat / 100) * product.quantity
            }
          })
        })
      })
      // this2.quoteDetailsUpdated.emit(this2.fetchedQuote)
    })
  }
}
