import { Component, ViewChild, EventEmitter } from '@angular/core';
import { MatDialogRef} from '@angular/material';
import { AddTextRowComponent } from '../addTextRow.component';



@Component({
  selector: 'app-add-text-row-dialog',
  templateUrl: './addTextRowDialog.component.html',
})

export class AddTextRowDialogComponent {
  addTextToQuoteEmit = new EventEmitter();
  // @ViewChild(ProductSingleComponent)
  // private productSingleComponent: ProductSingleComponent;

  constructor(
    public dialogRef: MatDialogRef<AddTextRowComponent>
  ) {}

  closeDialog() {
    this.dialogRef.close()
  }
  // saved(data) {
  //   this.dialogRef.close(data)
  // }
  addProductToQuote(result) {
    // this.onAdd.emit(result);
  }

  addTextToQuote(result) {
    this.dialogRef.close()
    this.addTextToQuoteEmit.emit(result);
  }
}
