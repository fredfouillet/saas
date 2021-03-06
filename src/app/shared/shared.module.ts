import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// import { AutocompleteComponent } from '../autocomplete/autocomplete.component'
import { AutocompleteModule } from '../autocomplete/autocomplete.module'
import {PictureModule} from '../picture/picture.module';
import { HeaderTitleComponent } from '../nav/headerTitle/headerTitle.component';



// import { TRANSLATION_PROVIDERS, TranslatePipe, TranslateService }   from '../translate';
import { TranslateModule} from '../translate/translate.module';

// import { RoundPipe} from './round.pipe';
// import { CurrencyPipe} from './round.pipe';
// import { HeaderComponent } from '../nav/header/header.component';
import { SortComponent } from './sort/sort.component';
import { AddressComponent } from './address/address.component';
// import { newObjDialogComponent } from '../nav/newObjDialog/newObjDialog.component';
import {DeleteDialogComponent} from '../nav/deleteDialog/deleteDialog.component'
import {AddressService} from './address/address.service'

// import { LoadingInAppComponent } from '../nav/loadingInApp/loadingInApp.component';
// import { LoginInAppComponent } from '../nav/loginInApp/loginInApp.component';

// import {CommentModule} from '../comment/comment.module';
import {SharedSmallModule} from './sharedSmall.module'
import {MatRadioModule} from '@angular/material';
import {MatSelectModule} from '@angular/material';

@NgModule({
  imports:      [

    SharedSmallModule,
    CommonModule,
    FormsModule,
    AutocompleteModule,
    PictureModule,
    // CommentModule,
    TranslateModule,
    MatRadioModule,
    MatSelectModule,


  ],
  declarations: [
    SortComponent,
    AddressComponent,
    // RoundPipe,
    // AutocompleteComponent,
    // TranslatePipe,
    // HeaderComponent,
    // newObjDialogComponent,
    // LoadingInAppComponent,
    // LoginInAppComponent,
    DeleteDialogComponent,
    HeaderTitleComponent,

  ],
  exports: [
    // TranslatePipe,
    SharedSmallModule,
    AutocompleteModule,
    CommonModule,
    FormsModule,
    // RoundPipe,
    // HeaderComponent,
    SortComponent,
    AddressComponent,
    // newObjDialogComponent,
    // LoadingComponent,
    // LoadingInAppComponent,
    // LoginInAppComponent,
    PictureModule,
    DeleteDialogComponent,
    HeaderTitleComponent,
    // CommentModule,
    // AutocompleteComponent,
  ],
  providers: [
    AddressService,
    // TRANSLATION_PROVIDERS,
    // TranslateService,
  ],
  entryComponents: [
    DeleteDialogComponent
  ]
})
export class SharedModule { }
