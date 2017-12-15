import { Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
// import { AuthService} from '../auth/auth.service';
import { PaiementQuoteService} from '../paiementQuote/paiementQuote.service';
import { QuoteService} from '../quote/quote.service';

import { PaiementQuote} from '../paiementQuote/paiementQuote.model';
import { ToastsManager} from 'ng2-toastr';
// import { MatDialog} from '@angular/material';
// import { Router} from '@angular/router';
// import { Location} from '@angular/common';
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
  // @Input() userId = '';
  // @Input() idQuote = '';
  // @Input() showHeader: boolean = true;
  // @Output() getPaiementQuotesCross: EventEmitter<any> = new EventEmitter();
  // @Input() showCreate: boolean = true;

  // fetchedPaiementQuoteGraphs: PaiementQuoteGraph[] = [];
  // @ViewChild(BaseChartDirective) public chart: BaseChartDirective;


  // paginationData = {
  //   currentPage: 1,
  //   itemsPerPage: 0,
  //   totalItems: 0
  // };
  // emptyRow = {data: [0, 0, 0, 0, 0, 0, 0, 0, 0 , 0, 0, 0], label: '', year: 0, ready: false}
  lineChartDataGraph1 = [ new EmptyRow(), new EmptyRow()]
  lineChartDataGraph2 = [ new EmptyRow(), new EmptyRow() ]
  lineChartDataGraph3 = [ new EmptyRow(), new EmptyRow() ]
  lineChartDataGraph4 = [ new EmptyRow(), new EmptyRow() ]
  donutChartDataGraph1 = {
    ready: [],
    labels: [],
    data: []
  }

  // donutChartDataGraph1 = { "labels": ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'], "data": [350, 450, 100] }


  nameGraph : string = ''
  serieNumber: number = 0
  label: string = ''
  typeSum: string = ''


  search: Search = new Search();
  // search = {
  //   orderBy : '',
  //   search: '',
  //   idQuote:'',
  // };

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
  ) {}






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
  initArrays(){

    this.lineChartDataGraph1 = [ new EmptyRow(), new EmptyRow() ]
    this.lineChartDataGraph2 = [ new EmptyRow(), new EmptyRow() ]
    this.lineChartDataGraph3 = [ new EmptyRow(), new EmptyRow() ]
    this.lineChartDataGraph4 = [ new EmptyRow(), new EmptyRow() ]
    this.donutChartDataGraph1 =  {
      ready:[],
      labels: [],
      data: []
    }
  }

  getData() {
        let newSearch = new Search()
        newSearch = new Search()
        newSearch.year = this.year;
        newSearch.statusQuote = ''
        this.getPaiementQuotesGraph(newSearch).then((res: any) => {
          this.nameGraph = 'lineChartDataGraph1';
          this.serieNumber = 0
          this.label = this.translateService.instant('Paiement')
          this.typeSum = 'amountTotal';
          this[this.nameGraph][this.serieNumber].ready = true;
          this[this.nameGraph][this.serieNumber].label = this.label;
          res.item.forEach((element, index) => {
            this[this.nameGraph][this.serieNumber].year = element._id.year
            this[this.nameGraph][this.serieNumber].data[element._id.month - 1] = element[this.typeSum]
          })

          this.nameGraph = 'lineChartDataGraph3';
          this.serieNumber = 0
          this.label = this.translateService.instant('Count Paiement');
          this.typeSum = 'count';
          this[this.nameGraph][this.serieNumber].ready = true
          this[this.nameGraph][this.serieNumber].label = this.label
          res.item.forEach((element, index) => {
            this[this.nameGraph][this.serieNumber].year = element._id.year
            this[this.nameGraph][this.serieNumber].data[element._id.month - 1] = element[this.typeSum]
          })
        })


        newSearch = new Search()
        newSearch.year = this.year
        newSearch.statusQuote = this.translateService.instant('paid')
        this.getQuotesGraph(newSearch).then((res: any) => {
          let totalData = 0;
          res.item.forEach((element, index) => {
            totalData += element.amountTotal
          })
          this.donutChartDataGraph1.data[2] = totalData
          this.donutChartDataGraph1.labels[2] = this.translateService.instant('Intervention Paid')
          this.donutChartDataGraph1.ready[2] = true
        })


        newSearch = new Search()
        newSearch.year = this.year
        newSearch.statusQuote = this.translateService.instant('pending')
        this.getQuotesGraph(newSearch).then((res: any) => {
          let totalData = 0;
          res.item.forEach((element, index) => {
            totalData += element.amountTotal
          })
          this.donutChartDataGraph1.data[3] = totalData
          this.donutChartDataGraph1.labels[3] = this.translateService.instant('Pending Intervention')
          this.donutChartDataGraph1.ready[3] = true
        })

        newSearch = new Search()
        newSearch.year = this.year
        newSearch.statusQuote = 'rejected'
        this.getQuotesGraph(newSearch).then((res: any) => {
          let totalData = 0;
          res.item.forEach((element, index) => {
            totalData += element.amountTotal
          })
          this.donutChartDataGraph1.data[4] = totalData
          this.donutChartDataGraph1.labels[4] = this.translateService.instant('Rejected intervention')
          this.donutChartDataGraph1.ready[4] = true
        })


        newSearch = new Search()
        newSearch.year = this.year
        newSearch.statusQuote = 'signed'
        this.getQuotesGraph(newSearch).then((res: any) => {
          let totalData = 0;
          res.item.forEach((element, index) => {
            totalData += element.amountTotal
          })
          this.donutChartDataGraph1.data[1] = totalData
          this.donutChartDataGraph1.labels[1] = this.translateService.instant('Quote Signed')
          this.donutChartDataGraph1.ready[1] = true

          this.nameGraph = 'lineChartDataGraph2'
          this.serieNumber = 0
          this.label = this.translateService.instant('Quotes Signed')
          this.typeSum = 'amountTotal'
          this[this.nameGraph][this.serieNumber].ready = true
          this[this.nameGraph][this.serieNumber].label = this.label
          res.item.forEach((element, index) => {
            this[this.nameGraph][this.serieNumber].year = element._id.year
            this[this.nameGraph][this.serieNumber].data[element._id.month - 1] = element[this.typeSum]
          })


          this.nameGraph = 'lineChartDataGraph4'
          this.serieNumber = 0
          this.label = this.translateService.instant('Count Quotes Signed')
          this.typeSum = 'count'
          this[this.nameGraph][this.serieNumber].ready = true
          this[this.nameGraph][this.serieNumber].label = this.label
          res.item.forEach((element, index) => {
            this[this.nameGraph][this.serieNumber].year = element._id.year
            this[this.nameGraph][this.serieNumber].data[element._id.month - 1] = element[this.typeSum]
          })
        })



        newSearch = new Search()
        newSearch.year = this.year
        newSearch.statusQuote = ''
        this.getQuotesGraph(newSearch).then((res: any) => {
          let totalData = 0;
          res.item.forEach((element, index) => {
            totalData += element.amountTotal
          })
          this.donutChartDataGraph1.data[0] = totalData
          this.donutChartDataGraph1.labels[0] = 'Quote'
          this.donutChartDataGraph1.ready[0] = true

          this.nameGraph = 'lineChartDataGraph1'
          this.serieNumber = 1
          this.label = this.translateService.instant('Intervention')
          this.typeSum = 'amountTotal'
          this[this.nameGraph][this.serieNumber].ready = true
          this[this.nameGraph][this.serieNumber].label = this.label
          res.item.forEach((element, index) => {
            this[this.nameGraph][this.serieNumber].year = element._id.year
            this[this.nameGraph][this.serieNumber].data[element._id.month - 1] = element[this.typeSum]
          })

          this.nameGraph = 'lineChartDataGraph2'
          this.serieNumber = 1
          this.label = this.translateService.instant('Intervention')
          this.typeSum = 'amountTotal'
          this[this.nameGraph][this.serieNumber].ready = true
          this[this.nameGraph][this.serieNumber].label = this.label
          res.item.forEach((element, index) => {
            this[this.nameGraph][this.serieNumber].year = element._id.year
            this[this.nameGraph][this.serieNumber].data[element._id.month - 1] = element[this.typeSum]
          })


          this.nameGraph = 'lineChartDataGraph3'
          this.serieNumber = 1
          this.label = this.translateService.instant('Count Interventions')
          this.typeSum = 'count'
          this[this.nameGraph][this.serieNumber].ready = true
          this[this.nameGraph][this.serieNumber].label = this.label
          res.item.forEach((element, index) => {
            this[this.nameGraph][this.serieNumber].year = element._id.year
            this[this.nameGraph][this.serieNumber].data[element._id.month - 1] = element[this.typeSum]
          })

          this.nameGraph = 'lineChartDataGraph4'
          this.serieNumber = 1
          this.label = this.translateService.instant('count All Interventions')
          this.typeSum = 'count'
          this[this.nameGraph][this.serieNumber].ready = true
          this[this.nameGraph][this.serieNumber].label = this.label
          res.item.forEach((element, index) => {
            this[this.nameGraph][this.serieNumber].year = element._id.year
            this[this.nameGraph][this.serieNumber].data[element._id.month - 1] = element[this.typeSum]
          })
        })
  }




  // lineChart
    // public lineChartDataGraph1:Array<any>
    // public lineChartDataGraph2:Array<any>


    public lineChartLabels:Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'oct', 'nov','dec'];
    public lineChartOptions:any = {
      responsive: true
    };
    public lineChartColors:Array<any> = [];
    public lineChartLegend:boolean = true;
    // public lineChartType:string = 'line';


    // public chartClicked(e:any):void {
    //   console.log(e);
    // }
    //
    // public chartHovered(e:any):void {
    //   console.log(e);
    // }





  //
  // goBack() {
  //   this.location.back();
  // }

  getQuotesGraph(search: Search) {
    const this2 = this
    return new Promise(function(resolve, reject) {
      this2.quoteService.getQuotesGraph(search)
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
            console.log(error) }
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
