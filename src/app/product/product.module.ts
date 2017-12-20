import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';


import { ProductDialogComponent } from './single/dialog/productDialog.component';
import { ProductsDialogComponent } from './products/dialog/productsDialog.component';

import { ProductsComponent} from './products/products.component';
import { ProductSingleComponent} from './single/productSingle.component';
import { ProductService} from './product.service';
import { CompanieModule } from '../companie/companie.module';
import { ProductRouting} from './productRouting.module';
// import { MaterialModule } from '@angular/material';


import {SharedModule } from '../shared/shared.module';


@NgModule({
  imports:      [
    ProductRouting,
    CommonModule,
    FormsModule,
    // MaterialModule,
    ReactiveFormsModule,
    CompanieModule,
    SharedModule,
  ],
  declarations: [

    ProductsComponent,
    ProductSingleComponent,
    ProductDialogComponent,
    ProductsDialogComponent,

  ],
  exports:      [ ProductsComponent ],
  providers:    [
    ProductService,
  ],
  entryComponents: [
    ProductDialogComponent,
    ProductsDialogComponent,
  ]
})
export class ProductModule { }
