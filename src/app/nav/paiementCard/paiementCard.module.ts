import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import { PaiementCardComponent} from './paiementCard.component';

import {SharedSmallModule } from '../../shared/sharedSmall.module';

@NgModule({
  imports:      [

    RouterModule,
    CommonModule,
    SharedSmallModule,
  ],
  declarations: [

    PaiementCardComponent,
  ],
  exports:      [
    PaiementCardComponent,
  ],
  providers:    [
  ],
  entryComponents: [
  ]
})
export class PaiementCardModule { }
