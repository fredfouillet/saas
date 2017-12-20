import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { TextToQuote } from '../../../../quote.model'


@Component({
  selector: 'app-add-text-row',
  templateUrl: './addTextRow.component.html',
  styleUrls: ['../../quoteDetails.component.css'],
})
export class AddTextRowComponent implements OnInit {
  textToQuote: TextToQuote = new TextToQuote();

  @Output() addTextToQuote: EventEmitter<any> = new EventEmitter();
  constructor() {
  }


  ngOnInit() {}

  addText() {
    this.addTextToQuote.emit(this.textToQuote)
    this.textToQuote = new TextToQuote()
  }

}
