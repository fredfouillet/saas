import { Component, Input } from '@angular/core';
import { Quote, StatusQuotes } from '../../quote.model';

@Component({
  selector: 'app-quote-status',
  templateUrl: './quoteStatus.component.html',
  styleUrls: ['./quoteStatus.component.css'],
})
export class QuoteStatusComponent {
  @Input() fetchedQuote: Quote = new Quote();
  @Input() showSingleSelected: boolean = false;
  statusQuotes = StatusQuotes;
  statusQuotesSingleSelected = StatusQuotes;

  constructor() { }

  ngOnChanges() {
    if(this.showSingleSelected) {
      this.statusQuotesSingleSelected = []
      this.statusQuotesSingleSelected.push(this.statusQuotes.find((statusQuote) => {
        return statusQuote.indexStatus === this.fetchedQuote.statusQuote;
      }))

      console.log(this.statusQuotesSingleSelected)
    }
  }
}
