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
    labels: [],
    data: []
  }
  search: Search = new Search();
  // search = {
  //   orderBy : '',
  //   search: '',
  //   idQuote:'',
  // };

  constructor(
    private paiementQuoteService: PaiementQuoteService,
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
  }
  getData() {
        let newSearch = new Search()

        newSearch = new Search()
        newSearch.year = this.year
        newSearch.isSigned = false
        this.getPaiementQuotesGraph(newSearch).then((res: any) => {
          let nameGraph : string = ''
          let serieNumber: number = 0
          let label: string = ''
          let typeSum: string = ''

          nameGraph = 'lineChartDataGraph1'
          serieNumber = 0
          label = 'Paiement'
          typeSum = 'amountTotal'
          this[nameGraph][serieNumber].ready = true
          this[nameGraph][serieNumber].label = label
          res.item.forEach((element, index) => {
            this[nameGraph][serieNumber].year = element._id.year
            this[nameGraph][serieNumber].data[element._id.month - 1] = element[typeSum]
          })

          nameGraph = 'lineChartDataGraph3'
          serieNumber = 0
          label = 'Count Paiement'
          typeSum = 'count'
          this[nameGraph][serieNumber].ready = true
          this[nameGraph][serieNumber].label = label
          res.item.forEach((element, index) => {
            this[nameGraph][serieNumber].year = element._id.year
            this[nameGraph][serieNumber].data[element._id.month - 1] = element[typeSum]
          })

        })




        newSearch = new Search()
        newSearch.year = this.year
        newSearch.isSigned = false
        this.getQuotesGraph(newSearch).then((res: any) => {

          let totalData = 0;
          res.item.forEach((element, index) => {
            console.log(element)
            totalData += element.amountTotal
          })
          this.donutChartDataGraph1.data[0] = totalData
          this.donutChartDataGraph1.labels[0] = 'Quote'



          let nameGraph : string = ''
          let serieNumber: number = 0
          let label: string = ''
          let typeSum: string = ''

          nameGraph = 'lineChartDataGraph1'
          serieNumber = 1
          label = 'Quote'
          typeSum = 'amountTotal'
          this[nameGraph][serieNumber].ready = true
          this[nameGraph][serieNumber].label = label
          res.item.forEach((element, index) => {
            this[nameGraph][serieNumber].year = element._id.year
            this[nameGraph][serieNumber].data[element._id.month - 1] = element[typeSum]
          })

          nameGraph = 'lineChartDataGraph2'
          serieNumber = 1
          label = 'Quote'
          typeSum = 'amountTotal'
          this[nameGraph][serieNumber].ready = true
          this[nameGraph][serieNumber].label = label
          res.item.forEach((element, index) => {
            this[nameGraph][serieNumber].year = element._id.year
            this[nameGraph][serieNumber].data[element._id.month - 1] = element[typeSum]
          })

          nameGraph = 'lineChartDataGraph2'
          serieNumber = 0
          label = 'Quotes Signed'
          typeSum = 'amountTotal'
          this[nameGraph][serieNumber].ready = true
          this[nameGraph][serieNumber].label = label
          res.item.forEach((element, index) => {
            this[nameGraph][serieNumber].year = element._id.year
            this[nameGraph][serieNumber].data[element._id.month - 1] = element[typeSum]
          })

          nameGraph = 'lineChartDataGraph3'
          serieNumber = 1
          label = 'Count Quotes'
          typeSum = 'count'
          this[nameGraph][serieNumber].ready = true
          this[nameGraph][serieNumber].label = label
          res.item.forEach((element, index) => {
            this[nameGraph][serieNumber].year = element._id.year
            this[nameGraph][serieNumber].data[element._id.month - 1] = element[typeSum]
          })

          nameGraph = 'lineChartDataGraph4'
          serieNumber = 1
          label = 'count All Quotes'
          typeSum = 'count'
          this[nameGraph][serieNumber].ready = true
          this[nameGraph][serieNumber].label = label
          res.item.forEach((element, index) => {
            this[nameGraph][serieNumber].year = element._id.year
            this[nameGraph][serieNumber].data[element._id.month - 1] = element[typeSum]
          })

          nameGraph = 'lineChartDataGraph4'
          serieNumber = 0
          label = 'Count Quotes Signed'
          typeSum = 'count'
          this[nameGraph][serieNumber].ready = true
          this[nameGraph][serieNumber].label = label
          res.item.forEach((element, index) => {
            this[nameGraph][serieNumber].year = element._id.year
            this[nameGraph][serieNumber].data[element._id.month - 1] = element[typeSum]
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
            // this[nameGraph][serieNumber].ready = true
            // this[nameGraph][serieNumber].label = label
            // res.item.forEach((element, index) => {
            //   this[nameGraph][serieNumber].year = element._id.year
            //   this[nameGraph][serieNumber].data[element._id.month - 1] = element[typeSum]
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
            // this[nameGraph][serieNumber].ready = true
            // this[nameGraph][serieNumber].label = label
            // res.item.forEach((element, index) => {
            //   this[nameGraph][serieNumber].year = element._id.year
            //   this[nameGraph][serieNumber].data[element._id.month - 1] = element[typeSum]
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
