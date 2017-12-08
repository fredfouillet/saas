import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


// import { AdminGuardService} from '../admin/services/adminGuard';

import { ReportingsComponent} from './reportings.component';


import { PaiementGuardService} from '../companie/single/paiement/paiementGuard.service';
import { AuthGuardService} from '../auth/authguard.service';



export const routes: Routes = [
  {path: '', component: ReportingsComponent, canActivate: [AuthGuardService, PaiementGuardService]},
  // {path: 'new', component: EditReportingComponent, canActivate: [AuthGuardService, PaiementGuardService]},
  // {path: 'new/:idQuote', component: EditReportingComponent, canActivate: [AuthGuardService, PaiementGuardService]},
  // // {path: 'new/:idClient/:idProject', component: EditReportingComponent, canActivate: [AuthGuardService, PaiementGuardService]},
  // {path: 'edit/:idReporting', component: EditReportingComponent, canActivate: [AuthGuardService, PaiementGuardService]},
  // // {path: ':id', component: ReportingDetailComponent, canActivate: [AuthGuardService, PaiementGuardService]},
  // {path: 'public/:idReporting', component: EditReportingComponent},

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRouting {}
