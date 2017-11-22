import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { DrawingComponent } from './drawing.component'
import { FormsModule } from '@angular/forms';
import { SharedSmallModule } from '../../../shared/sharedSmall.module';
import { MatSliderModule} from '@angular/material';
import { MatSlideToggleModule} from '@angular/material';
// import { SignaturePadModule } from '../angular2-signaturepad';

// import { UserModule} from '../user/user.module'
// import {NewUserComponent} from '../user/singleUser/newUser.component'
import {SharedModule } from '../../../shared/shared.module';
// import { newObjDialogComponent } from './newObjDialog/newObjDialog.component';

// import { FormService} from './form/form.service';
// import { UserFormsComponent} from './form/list/userForms.component';
// import { UserFormsUploadAndList} from './form/both/userFormsUploadAndList.component';
// import { SeeDrawingDialogComponent} from './form/seeDrawingDialog/seeDrawingDialog.component';

// import { EditOptionsComponentDialog} from './form/single/modalLibrary/modalLibrary.component';

// import { FormComponent} from './form/single/form.component';
// import { MaterialModule } from '@angular/material';
// import { ProgressBarModule} from 'ng2-progress-bar';
// import { MatTabsModule} from '@angular/material';


import {CanvasWhiteboardModule} from 'ng2-canvas-whiteboard';


@NgModule({
  imports: [
    // CommonModule,
    FormsModule,
    SharedSmallModule,
    MatSliderModule,
    MatSlideToggleModule,
    // SignaturePadModule,
    SharedModule,
    CanvasWhiteboardModule,
    // UserModule,
    // MaterialModule,
    // MatTabsModule,
    // ProgressBarModule,

  ],
  declarations: [
    DrawingComponent,
    // UserFormsComponent,
    // UserFormsUploadAndList,
    // SeeDrawingDialogComponent,
    // EditOptionsComponentDialog,
    // FormComponent,
    // NewUserComponent
  ],
  exports: [
    DrawingComponent,

  ],
  providers: [
    // FormService,
  ],
  entryComponents: [
    // SeeDrawingDialogComponent,
    // EditOptionsComponentDialog,
  ]
})
export class DrawingModule { }
