import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QuoteComponent } from '../quote.component';
import { Search } from '../../../shared/shared.model';



@Component({
  selector: 'edit-options-dialog',
  templateUrl: './quoteDialog.component.html',
  styleUrls: ['./quoteDialog.component.css'],
})

export class QuoteDialogComponent {
  search: Search = new Search()
  // @ViewChild(QuoteSingleComponent)
  // private quoteSingleComponent: QuoteSingleComponent;

  constructor(
    public dialogRef: MatDialogRef<QuoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.search = data.search
  }
  closeDialog(result) {
    this.dialogRef.close()
  }
  saved(data) {
  }

}
