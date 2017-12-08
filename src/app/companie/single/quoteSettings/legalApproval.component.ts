import {Component, Input} from '@angular/core';


import {Companie} from '../../companie.model';

@Component({
  selector: 'app-quote-legal-approval',
  templateUrl: './legalApproval.component.html',
  styleUrls: ['../../companie.component.css'],
})

export class LegalApprovalComponent {
  @Input() fetchedCompanie: Companie = new Companie()
  VATvalueToAdd: number;

  constructor(
  ) {}


  addVAT() {
    if(this.VATvalueToAdd) {
      this.fetchedCompanie.modelVATs.push(this.VATvalueToAdd * 1)
      this.VATvalueToAdd = undefined
    }
  }
  removeVAT(i: number) {
    this.fetchedCompanie.modelVATs.splice(i, 1)
  }

}
