import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Response, Headers, Http, RequestOptions} from '@angular/http';
import {ErrorService} from '../errorHandler/error.service';
import {UserCalendar} from './userCalendar.model';
import {ToastsManager} from 'ng2-toastr';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
import { AuthService } from '../auth/auth.service';
import { Config } from '../shared/config.model';
import { GlobalEventsManager } from '../globalEventsManager';


@Injectable()
export class UserCalendarService {

  private url = Config.backendURL;
//  private token: string = localStorage.getItem('id_token');
//  private userCalendarId: string = localStorage.getItem('userCalendarId');
  // private userCalendars = [];
  // private singleUserCalendar = Object;

  constructor(
    private http: Http,
    private errorService: ErrorService,
    private toastr: ToastsManager,
    private authService: AuthService,
    private globalEventsManager: GlobalEventsManager
  ) {}



  getUserCalendars(page: number, search: any) {

    this.globalEventsManager.isLoadding(true);
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.authService.currentUser.token);
    let options = new RequestOptions({ headers: headers, search: search});
    return this.http.get(this.url + 'userCalendar/page/' + page , options)
      .timeout(9000)
      .map((response: Response) => {
        this.globalEventsManager.isLoadding(false);
        const userCalendars = response.json();

        return userCalendars;
      })
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  countNewItemForUser(){
    this.globalEventsManager.isLoadding(true);
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.authService.currentUser.token);
    let options = new RequestOptions({ headers: headers});
    return this.http.get(this.url + 'userCalendar/countNewItemForUser/' + this.authService.currentUser.userId, options)
      .timeout(9000)
      .map((response: Response) => {
        this.globalEventsManager.isLoadding(false);
        const userCalendars = response.json();
        return userCalendars;
      })
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  //getUserCalendar(id: string) : Observable<UserCalendar> {
  getUserCalendar(id: string) {
    this.globalEventsManager.isLoadding(true);
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.authService.currentUser.token);
    return this.http.get(this.url + 'userCalendar/' + id, {headers: headers})
      .map((response: Response) => {
        this.globalEventsManager.isLoadding(false);
        //console.log(response.json().item)
        return response.json().item;
      //  this.singleForm = response.json();
        //return this.singleForm;
      })
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }




  deleteUserCalendar(id: string) {
    this.globalEventsManager.isLoadding(true);
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.authService.currentUser.token);
    return this.http.delete(this.url + 'userCalendar/' + id, {headers: headers})
      .map((response: Response) => {
      //  console.log("delete",response)
      this.globalEventsManager.isLoadding(false);
        return response.json();
      //  this.singleForm = response.json();
        //return this.singleForm;
      })
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  saveUserCalendar(userCalendar) {
    this.globalEventsManager.isLoadding(true);
  //  console.log("this.authService.currentUser.token",this.authService.currentUser.token);
  //  delete userCalendar._id;
    delete userCalendar._id
  //console.log(userCalendar)
    const body = JSON.stringify(userCalendar);
    const headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.authService.currentUser.token);
    return this.http.post(this.url + 'userCalendar/',body, {headers: headers})
      .map(response => {
        this.globalEventsManager.isLoadding(false);
        return response.json();
      })
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  updateUserCalendar(userCalendar: UserCalendar) {
    this.globalEventsManager.isLoadding(true);
    // console.log(userCalendar)
    const body = JSON.stringify(userCalendar);
    const headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.authService.currentUser.token);
    return this.http.put(this.url + 'userCalendar/' + userCalendar._id, body, {headers: headers})
      .map(response => {
        this.globalEventsManager.isLoadding(false);
        return response.json()
      })
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }


  //
  // deleteForm(form: Form) {
  //   this.forms.splice(this.forms.indexOf(form), 1);
  //   let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.authService.currentUser.token);
  //   return this.http.delete(this.url + 'forms/' + form, {headers: headers})
  //     .map((response: Response) => {
  //       this.toastr.success('Form deleted successfully!');
  //       response.json();
  //     })
  //     .catch((error: Response) => {
  //       this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }
  //
  // getSingleForm(formId) {
  //   let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.authService.currentUser.token);
  //   return this.http.get(this.url + 'forms/edit/' + formId, {headers: headers})
  //     .map((response: Response) => {
  //       this.singleForm = response.json();
  //       return this.singleForm;
  //     })
  //     .catch((error: Response) => {
  //       this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }
}
