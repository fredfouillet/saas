import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';


import {Companie} from '../../../companie.model';

@Component({
  selector: 'app-quote-legal-approval',
  templateUrl: './legalApproval.component.html',
  styleUrls: ['../../../companie.component.css'],
})

export class LegalApprovalComponent {
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Input() fetchedCompanie: Companie = new Companie()
  legalApprovalValueToAdd: string = '';
  showLoginInApp: boolean = false;

  constructor(
  ) {}

  loginInAppDone(){
    this.showLoginInApp = false
  }

  add() {
    if(this.legalApprovalValueToAdd) {
      this.fetchedCompanie.legalApprovals.push(this.legalApprovalValueToAdd)
      this.legalApprovalValueToAdd = ''
      this.showLoginInApp = true
      this.save.emit()
    }
  }
  remove(i: number) {
    this.fetchedCompanie.legalApprovals.splice(i, 1)
    this.showLoginInApp = true
    this.save.emit()
  }

}
