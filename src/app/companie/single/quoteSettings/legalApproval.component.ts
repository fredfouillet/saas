import {Component, Input} from '@angular/core';


import {Companie} from '../../companie.model';

@Component({
  selector: 'app-quote-legal-approval',
  templateUrl: './legalApproval.component.html',
  styleUrls: ['../../companie.component.css'],
})

export class LegalApprovalComponent {
  @Input() fetchedCompanie: Companie = new Companie()
  legalApprovalValueToAdd: string = '';

  constructor(
  ) {}


  add() {
    if(this.legalApprovalValueToAdd) {
      this.fetchedCompanie.legalApprovals.push(this.legalApprovalValueToAdd)
      this.legalApprovalValueToAdd = ''
    }
  }
  remove(i: number) {
    this.fetchedCompanie.legalApprovals.splice(i, 1)
  }

}
