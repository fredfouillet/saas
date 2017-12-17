import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Response, Headers, Http, RequestOptions} from '@angular/http';
import {ErrorService} from '../../errorHandler/error.service';

// import {User, UserCross} from './user.model';
// import {Companie} from '../companie/companie.model';
// import {ToastsManager} from 'ng2-toastr';


// import { map } from 'rxjs/operators';

// import {newPassword} from './user.model';
// import {AuthService} from '../auth/auth.service';
// import { Config } from '../shared/config.model';




@Injectable()
export class AddressService {

  // private url = Config.backendURL;
  //private token: string = localStorage.getItem('id_token');
  //private userId: string = localStorage.getItem('userId');
  // private users: User[] = [];
  // private currentUser: User = new User();

  constructor(
    private http: Http,
    private errorService: ErrorService,
    // private toastr: ToastsManager,
    // private authService: AuthService
  ) {}

  // get user forms from backend in order to display them in the front end

  getCityByZip(zip: string, lang: string) {

    if(lang === 'en') lang='US'
    if(lang === 'fr') lang='FR'

    if(lang === 'en') lang='USA'
    if(lang === 'fr') lang='FRANCE'

    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + zip + '%20' + lang )
    // return this.http.get('http://api.zippopotam.us/' + lang + '/' + zip )
      .timeout(15000)
      .map((response: Response) => {
        return response.json();
      })
      .catch((error: Response) => {
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      })
  }


}
