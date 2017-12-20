import { Component, ViewChild, EventEmitter } from '@angular/core';
import { MatDialogRef} from '@angular/material';
import { ProductsComponent } from '../products.component';



@Component({
  selector: 'app-products-dialog',
  templateUrl: './productsDialog.component.html',
})

export class ProductsDialogComponent {
  onAdd = new EventEmitter();
  // @ViewChild(ProductSingleComponent)
  // private productSingleComponent: ProductSingleComponent;

  constructor(public dialogRef: MatDialogRef<ProductsComponent>) {}

  closeDialog() {
    this.dialogRef.close()
  }
  saved(data) {
    this.dialogRef.close(data)
  }
  addProductToQuote(result) {
    this.onAdd.emit(result);
  }

}
