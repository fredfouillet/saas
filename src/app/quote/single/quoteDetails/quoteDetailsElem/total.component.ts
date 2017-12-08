import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import {
  Quote, DevisDetail, BucketProduct, StatusQuotes } from '../../../quote.model';

import { Search } from '../../../../shared/shared.model'
import { AuthService} from '../../../../auth/auth.service';
@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrls: ['../quoteDetails.component.css'],
})
export class TotalComponent implements OnInit {
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

  VATs: number[] = []
  legalApprovals: string[] = []

  approvalTempBool: boolean[]= []
  constructor(
    // private quoteService: QuoteService,
    // private templateQuoteService: TemplateQuoteService,
    // private projectService: ProjectService,
    // private userService: UserService,
    // private productService: ProductService,
    //    private modalService: NgbModal,
    // private toastr: ToastsManager,
    // public dialog: MatDialog,
    // private activatedRoute: ActivatedRoute,
    // private router: Router,
    // private location: Location,
    // private _fb: FormBuilder,
    public authService: AuthService,
    // private dragulaService: DragulaService,
    // private translateService: TranslateService,
  ) {
  }

  calculateQuote() {
    this.calculateQuoteEmit.emit()
  }

  ngOnInit() {
    // this.fetchedQuote.legalApprovals.push('')
    // this.fetchedQuote.legalApprovals.push('')
    // this.fetchedQuote.legalApprovals.push('')
    this.authService.getCurrentUser().ownerCompanies.forEach(companie => {
      this.VATs = companie.modelVATs
      this.legalApprovals = companie.legalApprovals
    })


    for (let i = 0; i < this.legalApprovals.length; i++) {
      this.approvalTempBool.push(false)
    }

    this.legalApprovals.forEach((legalApproval, i) => {
      this.fetchedQuote.legalApprovals.forEach(legalApprovalInQuote => {
        if(legalApproval === legalApprovalInQuote) {
          this.approvalTempBool[i] = true
        }
      })
    })

    // this.changeLegalApproval()

  }
  changeLegalApproval() {
    this.fetchedQuote.legalApprovals = []
    this.approvalTempBool.forEach((approvalTempSingle, i) => {
      if(approvalTempSingle) {
         this.fetchedQuote.legalApprovals.push(this.legalApprovals[i])
      }
    })



    // this.fetchedQuote.legalApprovals
    // console.log(checked)
    // console.log(value)
  }


}
