import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { QuoteService } from '../quote.service';
import { Quote } from '../quote.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ActionButtonsComponent } from './actionButtons/actionButtons.component';
import { TranslateService } from '../../translate/translate.service';
import { Search } from '../../shared/shared.model';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['../quote.component.css'],
})
export class QuoteComponent implements OnInit {
  // @ViewChild(SignaturePad) signaturePad: SignaturePad;
  // @ViewChild(PaiementQuotesComponent) paiementQuotesComponent: PaiementQuotesComponent;
  @ViewChild(ActionButtonsComponent) actionButtonsComponent: ActionButtonsComponent
  // loading: boolean = false;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() search: Search = new Search()
  @Input() isDialog: boolean = false

  showPaiements: boolean = false
  fetchedQuote: Quote = new Quote()

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  constructor(
    private quoteService: QuoteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    // private location: Location,
    private _fb: FormBuilder,
    public authService: AuthService,
    // private dragulaService: DragulaService,
    private translateService: TranslateService,
  ) {
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
    let this2 = this
    return new Promise(function(resolve, reject) {
      this2.quoteService.getQuote(id)
        .subscribe(
        res => {
          this2.fetchedQuote = res
          this2.fetchedQuote.clients.forEach(user => { this2.search.userId = user._id })
          resolve(this2.fetchedQuote)
        },
        error => {
          reject(error)
          console.log(error)
        }
        )
    })
  }


  ngOnInit() {
    if (this.search.parentQuoteId) {
      this.getQuote(this.search.parentQuoteId).then((parentQuote: Quote) => {
        this.fetchedQuote._id = ''
        this.fetchedQuote.typeQuote = 'invoice'
        this.fetchedQuote.quoteNumber = null
        this.getMaxQuoteNumber()

      })
    } else {
      this.fetchedQuote.typeQuote = this.search.typeQuote
      this.activatedRoute.params.subscribe((params: Params) => {
        if (params['idQuote']) {
          this.search.quoteId = params['idQuote']
          this.getQuote(params['idQuote'])
        } else {
          this.getMaxQuoteNumber()
        }
      })
    }
  }

  savedQuote(result) {
    this.getQuote(result.obj._id)
  }
}
