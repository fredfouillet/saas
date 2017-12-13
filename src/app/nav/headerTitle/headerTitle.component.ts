import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
// import {AuthService} from '../../auth/auth.service';
import { Location } from '@angular/common';
// import { Router} from '@angular/router';
import { TranslateService } from '../../translate/translate.service';
import { Search} from '../../shared/shared.model';

@Component({
  selector: 'app-header-title',
  templateUrl: './headerTitle.component.html',
  styleUrls: ['./headerTitle.component.css']
})
export class HeaderTitleComponent implements OnInit {
  @Input() title: string = '';
  @Input() isDialog: boolean = false;
  @Input() icon: string = '';
  @Input() typeObj: string = '';
  @Input() showBack: boolean = true;
  @Input() createNewButton: boolean = true;
  @Input() search: Search = new Search();
  @Output() saved: EventEmitter<any> = new EventEmitter();

// <app-newObjDialog [search]="search" (saved)="saved($event)" [typeObj]="'paiementQuote'"></app-newObjDialog>


  constructor(
    private translateService: TranslateService,
    private location: Location,
  ) {}


  ngOnInit() {

  }
  goBack() {
    this.location.back();
  }
  savedEmit(result) {
    this.saved.emit(result)
  }


}
