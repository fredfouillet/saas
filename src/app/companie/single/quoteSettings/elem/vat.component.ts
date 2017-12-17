import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Companie} from '../../../companie.model';

@Component({
  selector: 'app-quote-vat',
  templateUrl: './vat.component.html',
  styleUrls: ['../../../companie.component.css'],
})

export class VATComponent {
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Input() fetchedCompanie: Companie = new Companie()
  VATvalueToAdd: number;
  showLoginInApp: boolean = false;

  constructor(
  ) {}

  loginInAppDone() {
    this.showLoginInApp = false
  }
  addVAT() {
    if (this.VATvalueToAdd !== undefined) {
      this.fetchedCompanie.modelVATs.push(this.VATvalueToAdd * 1)
      this.fetchedCompanie.modelVATs.sort()

      this.VATvalueToAdd = undefined
      this.showLoginInApp = true
      this.save.emit()
    }
  }
  removeVAT (i: number) {
    this.fetchedCompanie.modelVATs.splice(i, 1)
    this.showLoginInApp = true
    this.save.emit()
  }

}
