import { Component, OnInit, Input} from '@angular/core';
import { AuthService} from '../../auth/auth.service';
import { QuoteService} from '../../quote/quote.service';
import { Quote, StatusQuotes, StatusQuotesInvoice} from '../../quote/quote.model';
import { ToastsManager} from 'ng2-toastr';
import { MatDialog} from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location} from '@angular/common';
import { Search, PaginationData } from '../../shared/shared.model';
// import { GlobalEventsManager } from '../../globalEventsManager';



@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['../quote.component.css'],
})
export class QuotesComponent implements OnInit {
  @Input() userId = '';
  @Input() projectId = '';
  @Input() showSearch = true;
  @Input() showBackButton = true;
  @Input() idProject: string = '';
  @Input() idClient: string = '';

  fetchedQuotes: Quote[] = [];
  loading: boolean = false
  paginationData = new PaginationData()

  statusQuotes = StatusQuotes
  statusQuotesInvoice = StatusQuotesInvoice
  @Input() search = new Search()

  constructor(
    private quoteService: QuoteService,
    private authService: AuthService,
    // private globalEventsManager: GlobalEventsManager,
  //  private modalService: NgbModal,
    private toastr: ToastsManager,
    public dialog: MatDialog,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
  ) {}


  ngOnChanges() {
    this.getQuotes(this.paginationData.currentPage, this.search);
  }
  ngOnInit() {
    this.search.orderBy = '-createdAt'
    this.activatedRoute.params.subscribe((params: Params) => {
      // if(params['searchType'] === 'quoteAssignedToMe') {
      //   this.search.isQuoteAssignedToMe = true
      //   this.getQuotes(this.paginationData.currentPage, this.search);
      // }
      if(params['searchType'] === 'invoice') {
        this.search.typeQuote = params['searchType']
        this.getQuotes(this.paginationData.currentPage, this.search);
      }
      if(params['searchType'] === 'quote') {
        this.search.typeQuote = params['searchType']
        this.getQuotes(this.paginationData.currentPage, this.search);
      }
    })


    // let this2 = this
    // setTimeout(function(){
    //   this2.search.userId = this2.userId
    //   this2.search.projectId = this2.projectId
    //   this2.search.orderBy = 'name'
    //   this2.getQuotes(1, this2.search)
    // }, 200);

  }


  // saveAsInvoice() {
  //   this.quoteService.saveAsInvoice(this.search.parentQuoteId)
  //     .subscribe(
  //     res => {
  //       // this.toastr.success('Great!', res.message)
  //       this.saved.emit(res)
  //       // this.goToInvoice(res.obj._id)
  //     }, error => { console.log(error) } )
  // }
  searchData() {
    this.getQuotes(this.paginationData.currentPage, this.search)
  }
  saved(result) {
    this.getQuotes(this.paginationData.currentPage, this.search)
  }
  // onSelectChange = ($event: any): void => {
  //   this.search.isQuoteAssignedToMe = $event.tab.content.viewContainerRef.element.nativeElement.getAttribute('data-isQuoteAssignedToMe')
  //   this.getQuotes(this.paginationData.currentPage, this.search);
  //
  // }


  // searchQuotes(){}

  //
  // goBack() {
  //   this.location.back();
  // }

  searchInput() {
    this.getQuotes(this.paginationData.currentPage, this.search)
  }

  orderBy(orderBy: string) {
    this.search.orderBy = orderBy
    this.getQuotes(this.paginationData.currentPage, this.search)
  }

  onDelete(id: string) {
    this.quoteService.deleteQuote(id)
      .subscribe(
        res => {
          this.toastr.success('Great!', res.message);
          console.log(res);
        },
        error => {
          console.log(error);
        }
      );
  }

  getPage(page: number) {
    this.getQuotes(page, this.search);
  }


  getQuotes(page: number, search: any) {
    // this.globalEventsManager.isLoadding(true);
    this.loading = true
    this.quoteService.getQuotes(page, search)
      .subscribe(
        res => {

        //  console.log("quotes");
        //  console.log(res);
          this.paginationData = res.paginationData;
          this.fetchedQuotes =  res.data
          this.fetchedQuotes.forEach((quote, i) => {
            this.statusQuotes.forEach(status => {
              if(status.indexStatus === quote.statusQuote)
                this.fetchedQuotes[i].statusQuoteString = status.label
            })
            this.statusQuotesInvoice.forEach(status => {
              if(status.indexStatus === quote.statusQuote)
                this.fetchedQuotes[i].statusQuoteString = status.label
            })
          })
          this.loading = false
        },
        error => {
          this.loading = false
          console.log(error);
        }
      );
  }


  isAdmin() {
    return this.authService.isAdmin();
  }


}
