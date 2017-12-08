import {Component, Input} from '@angular/core';


import {Companie} from '../../../companie.model';

@Component({
  selector: 'app-quote-vat',
  templateUrl: './vat.component.html',
  styleUrls: ['../../../companie.component.css'],
})

export class VATComponent {
  @Input() fetchedCompanie: Companie = new Companie()
  VATvalueToAdd: number;
  showLoginInApp: boolean = false;

  constructor(
  ) {}

  loginInAppDone(){
    this.showLoginInApp = false
  }
  addVAT() {
    if(this.VATvalueToAdd) {
      this.fetchedCompanie.modelVATs.push(this.VATvalueToAdd * 1)
      this.VATvalueToAdd = undefined
      this.showLoginInApp = true
    }
  }
  removeVAT(i: number) {
    this.fetchedCompanie.modelVATs.splice(i, 1)
    this.showLoginInApp = true
  }

}
