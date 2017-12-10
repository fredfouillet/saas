import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// import { AutocompleteComponent } from '../autocomplete/autocomplete.component'
import { AutocompleteModule } from '../autocomplete/autocomplete.module'
import {PictureModule} from '../picture/picture.module';



// import { TRANSLATION_PROVIDERS, TranslatePipe, TranslateService }   from '../translate';
import { TranslateModule} from '../translate/translate.module';

// import { RoundPipe} from './round.pipe';
// import { CurrencyPipe} from './round.pipe';
// import { HeaderComponent } from '../nav/header/header.component';
import { SortComponent } from './sort/sort.component';
// import { newObjDialogComponent } from '../nav/newObjDialog/newObjDialog.component';
import {DeleteDialogComponent} from '../nav/deleteDialog/deleteDialog.component'

// import { LoadingInAppComponent } from '../nav/loadingInApp/loadingInApp.component';
// import { LoginInAppComponent } from '../nav/loginInApp/loginInApp.component';

// import {CommentModule} from '../comment/comment.module';
import {SharedSmallModule} from './sharedSmall.module'
@NgModule({
  imports:      [

    SharedSmallModule,
    CommonModule,
    FormsModule,
    AutocompleteModule,
    PictureModule,
    // CommentModule,
    TranslateModule,


  ],
  declarations: [
    SortComponent,
    // RoundPipe,
    // AutocompleteComponent,
    // TranslatePipe,
    // HeaderComponent,
    // newObjDialogComponent,
    // LoadingInAppComponent,
    // LoginInAppComponent,
    DeleteDialogComponent,

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
    // newObjDialogComponent,
    // LoadingComponent,
    // LoadingInAppComponent,
    // LoginInAppComponent,
    PictureModule,
    DeleteDialogComponent,
    // CommentModule,
    // AutocompleteComponent,
  ],
  providers: [
    // TRANSLATION_PROVIDERS,
    // TranslateService,
  ],
  entryComponents: [
    DeleteDialogComponent
  ]
})
export class SharedModule { }
