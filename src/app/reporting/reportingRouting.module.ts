import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReportingsComponent} from './reportings.component';
import { PaiementGuardService} from '../companie/single/paiement/paiementGuard.service';
import { AuthGuardService} from '../auth/authguard.service';



export const routes: Routes = [
  {path: '', component: ReportingsComponent, canActivate: [AuthGuardService, PaiementGuardService]},
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRouting {}
