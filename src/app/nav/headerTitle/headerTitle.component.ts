import {Component, OnInit, Input} from '@angular/core';
// import {AuthService} from '../../auth/auth.service';
import { Location } from '@angular/common';
// import { Router} from '@angular/router';
import { TranslateService } from '../../translate/translate.service';

@Component({
  selector: 'app-header-title',
  templateUrl: './headerTitle.component.html',
  styleUrls: ['./headerTitle.component.css']
})
export class HeaderTitleComponent implements OnInit {
  @Input() title: string = '';
  @Input() icon: string = '';

  constructor(
    private translateService: TranslateService,
    private location: Location,
  ) {}


  ngOnInit() {

  }
  goBack() {
    this.location.back();
  }


}
