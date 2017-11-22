import {Component, OnInit, Input} from '@angular/core';

import {Router} from '@angular/router';
import { GlobalEventsManager } from '../../globalEventsManager';

@Component({
  selector: 'app-loadingInApp',
  templateUrl: './loadingInApp.component.html',
  styleUrls: ['./loadingInApp.component.css']
})
export class LoadingInAppComponent implements OnInit {
  // @Input() sidenav: any;
  loading: boolean = false

  constructor(
    // private authService: AuthService,
    private globalEventsManager: GlobalEventsManager,
    private router: Router,
  ) {
    this.globalEventsManager.isLoaddingEmitter.subscribe((mode) => {
        if (mode !== null) {
          this.loading = mode;
        }
    });
  }


  ngOnInit() {}


}
