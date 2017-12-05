import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import { Location } from '@angular/common';
import { Router} from '@angular/router';
import { TranslateService } from '../../translate/translate.service';
import { ToastsManager} from 'ng2-toastr';

@Component({
  selector: 'app-loginInApp',
  templateUrl: './loginInApp.component.html',
  styleUrls: ['./loginInApp.component.css']
})
export class LoginInAppComponent implements OnInit {
  @Output() loginInAppDone: EventEmitter<any> = new EventEmitter();

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private toastr: ToastsManager,
    private translateService: TranslateService,
  ) {}


  ngOnInit() {

  }

  loginInApp(password: string) {
    let userAuth = {
      email: this.authService.user.email,
      password: password
    }
    this.authService.signin(userAuth).subscribe(
      data => {
        this.toastr.success('Great!');
        localStorage.setItem('id_token', data.token);
        localStorage.setItem('token', data.token);
        this.loginInAppDone.emit(data.token)
        // location.reload();
      },
      error => console.log(error)
    );
  }

}
