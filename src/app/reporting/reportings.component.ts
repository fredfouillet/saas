import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
// import { AuthService} from '../auth/auth.service';
import { PaiementQuoteService } from '../paiementQuote/paiementQuote.service';
import { QuoteService } from '../quote/quote.service';

import { PaiementQuote } from '../paiementQuote/paiementQuote.model';
import { ToastsManager } from 'ng2-toastr';
import { PaiementQuoteGraph, EmptyRow } from './reporting.model'
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { Search } from '../shared/shared.model'
import { TranslateService } from '../translate/translate.service';


@Component({
  selector: 'app-reporting',
  templateUrl: './reportings.component.html',
  styleUrls: ['./reporting.component.css'],
})
export class ReportingsComponent implements OnInit {
  year: number = (new Date()).getFullYear()
  month: number = (new Date()).getMonth()
  ready: boolean = false;
  statusQuote = ['signed', 'paid', 'pending', 'rejected']
  emptyRowPaid = new EmptyRow();
  emptyRowPending = new EmptyRow();
  emptyRowRejected = new EmptyRow();
  emptyRowsigned = new EmptyRow();
  graphData: EmptyRow[] = []
  emptyRowPaidCount = new EmptyRow();
  emptyRowPendingCount = new EmptyRow();
  emptyRowRejectedCount = new EmptyRow();
  emptyRowsignedCount = new EmptyRow();
  graphDataCount: EmptyRow[] = []

  totalSigned = 0
  totalPending = 0
  totalRejected = 0
  totalPaid = 0

  loading: boolean = false
  // lineChartDataGraph1 = [ new EmptyRow(), new EmptyRow()]
  // lineChartDataGraph2 = [ new EmptyRow(), new EmptyRow() ]
  // lineChartDataGraph3 = [ new EmptyRow(), new EmptyRow() ]
  // lineChartDataGraph4 = [ new EmptyRow(), new EmptyRow() ]
  statusQuoteTranslate = [
    this.translateService.instant(this.statusQuote[0]),
    this.translateService.instant(this.statusQuote[1]),
    this.translateService.instant(this.statusQuote[2]),
    this.translateService.instant(this.statusQuote[3]),
  ]
  donutChartDataGraph1 = {
    labels: this.statusQuoteTranslate,
    data: []
  }

  // donutChartDataGraph1 = { "labels": ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'], "data": [350, 450, 100] }


  nameGraph: string = ''
  serieNumber: number = 0
  label: string = ''
  typeSum: string = ''

  public lineChartLabels: Array<any> = [
    this.translateService.instant('Jan'),
    this.translateService.instant('Feb'),
    this.translateService.instant('Mar'),
    this.translateService.instant('Apr'),
    this.translateService.instant('May'),
    this.translateService.instant('June'),
    this.translateService.instant('July'),
    this.translateService.instant('Aug'),
    this.translateService.instant('Sept'),
    this.translateService.instant('Oct'),
    this.translateService.instant('Nov'),
    this.translateService.instant('Dec')
  ];
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255,99,132,1)',
      // pointBackgroundColor: 'rgba(148,159,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      // pointBackgroundColor: 'rgba(77,83,96,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(58,159,142,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      // pointBackgroundColor: 'rgba(148,159,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // grey
      backgroundColor: 'rgba(87,45,235,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      // pointBackgroundColor: 'rgba(148,159,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartOptions: any = {
    responsive: true
  };

  public lineChartLegend: boolean = true;
  search: Search = new Search();

  constructor(
    private paiementQuoteService: PaiementQuoteService,
    private translateService: TranslateService,
    // private authService: AuthService,
    //  private modalService: NgbModal,
    private toastr: ToastsManager,
    // public dialog: MatDialog,
    // private router: Router,
    // private location: Location,
    private quoteService: QuoteService,
  ) { }

  ngOnInit() {
    this.getData()
  }
  nextYear() {
    this.year++
    this.initArrays()
    this.getData()
  }
  previousYear() {
    this.year--
    this.initArrays()
    this.getData()
  }
  initArrays() {
    this.ready = false;
    this.graphData = []
    this.graphDataCount = []

    this.emptyRowPaid = new EmptyRow();
    this.emptyRowPending = new EmptyRow();
    this.emptyRowRejected = new EmptyRow();
    this.emptyRowsigned = new EmptyRow();

    this.emptyRowPaidCount = new EmptyRow();
    this.emptyRowPendingCount = new EmptyRow();
    this.emptyRowRejectedCount = new EmptyRow();
    this.emptyRowsignedCount = new EmptyRow();

    this.donutChartDataGraph1 = {
      labels: this.statusQuote,
      data: []
    }
    this.totalSigned = 0
    this.totalPending = 0
    this.totalRejected = 0
    this.totalPaid = 0
  }

  getData() {
    const newSearch = new Search()
    newSearch.year = this.year
    this.getQuotesGraph(newSearch).then((res: any) => {


      res.item.forEach((element, index) => {
        if (element._id.statusQuote === 'signed') {
          this.totalSigned += element.amountTotal
          this.emptyRowPaid.data[element._id.month - 1] = element.amountTotal
          this.emptyRowPaid.label = this.translateService.instant(element._id.statusQuote)
          this.emptyRowPaid.year = element._id.year

          this.emptyRowPaidCount.data[element._id.month - 1] = element.count
          this.emptyRowPaidCount.label = this.translateService.instant(element._id.statusQuote)
          this.emptyRowPaidCount.year = element._id.year
        }
        if (element._id.statusQuote === 'pending') {
          this.totalPending += element.amountTotal
          this.emptyRowPending.data[element._id.month - 1] = element.amountTotal
          this.emptyRowPending.label = this.translateService.instant(element._id.statusQuote)
          this.emptyRowPending.year = element._id.year

          this.emptyRowPendingCount.data[element._id.month - 1] = element.count
          this.emptyRowPendingCount.label = this.translateService.instant(element._id.statusQuote)
          this.emptyRowPendingCount.year = element._id.year
        }
        if (element._id.statusQuote === 'rejected') {
          this.totalRejected += element.amountTotal
          this.emptyRowRejected.data[element._id.month - 1] = element.amountTotal
          this.emptyRowRejected.label = this.translateService.instant(element._id.statusQuote)
          this.emptyRowRejected.year = element._id.year

          this.emptyRowRejectedCount.data[element._id.month - 1] = element.count
          this.emptyRowRejectedCount.label = this.translateService.instant(element._id.statusQuote)
          this.emptyRowRejectedCount.year = element._id.year
        }
        if (element._id.statusQuote === 'paid') {
          this.totalPaid += element.amountTotal
          this.emptyRowsigned.data[element._id.month - 1] = element.amountTotal
          this.emptyRowsigned.label = this.translateService.instant(element._id.statusQuote)
          this.emptyRowsigned.year = element._id.year

          this.emptyRowsignedCount.data[element._id.month - 1] = element.count
          this.emptyRowsignedCount.label = this.translateService.instant(element._id.statusQuote)
          this.emptyRowsignedCount.year = element._id.year
        }
      })
      this.graphData.push(this.emptyRowsigned)
      this.graphData.push(this.emptyRowRejected)
      this.graphData.push(this.emptyRowPending)
      this.graphData.push(this.emptyRowPaid)

      this.graphDataCount.push(this.emptyRowsignedCount)
      this.graphDataCount.push(this.emptyRowRejectedCount)
      this.graphDataCount.push(this.emptyRowPendingCount)
      this.graphDataCount.push(this.emptyRowPaidCount)

      this.donutChartDataGraph1.data.push(Math.round(this.totalSigned))
      this.donutChartDataGraph1.data.push(Math.round(this.totalPaid))
      this.donutChartDataGraph1.data.push(Math.round(this.totalPending))
      this.donutChartDataGraph1.data.push(Math.round(this.totalRejected))
      // statusQuote = ['signed', 'paid', 'pending', 'rejected']


      this.ready = true
    })



  }



  getQuotesGraph(search: Search) {
    this.loading = true
    const this2 = this
    return new Promise(function(resolve, reject) {
      this2.quoteService.getQuotesGraph(search)
        .subscribe(
          res => {
            resolve(res)
            this2.loading = false
          },
          error => {
            reject(error)
            this2.loading = false
          }
        );
    })
  }

  getPaiementQuotesGraph(searchQuote: Search) {
    const this2 = this
    return new Promise(function(resolve, reject) {
      this2.paiementQuoteService.getPaiementQuotesGraph(searchQuote)
        .subscribe(
        res => {
          resolve(res)
          // this[this.nameGraph][this.serieNumber].ready = true
          // this[this.nameGraph][this.serieNumber].label = this.label
          // res.item.forEach((element, index) => {
          //   this[this.nameGraph][this.serieNumber].year = element._id.year
          //   this[this.nameGraph][this.serieNumber].data[element._id.month - 1] = element[this.typeSum]
          // })
        },
        error => {
          reject(error)
          console.log(error)
        }
        );
    })
  }





}
