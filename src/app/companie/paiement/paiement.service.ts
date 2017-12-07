import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Response, Headers, Http, RequestOptions} from '@angular/http';
import {ErrorService} from '../../errorHandler/error.service';
import {User} from '../../user/user.model';
import {Companie} from '../../companie/companie.model';
import {ToastsManager} from 'ng2-toastr';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';


// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
import {AuthService} from '../../auth/auth.service';
import { Config } from '../../shared/config.model';




@Injectable()
export class PaiementService {

  private url = Config.backendURL;
  //private token: string = localStorage.getItem('id_token');
  //private userId: string = localStorage.getItem('userId');
  private users: User[] = [];

  constructor(
    private http: Http,
    private errorService: ErrorService,
    private toastr: ToastsManager,
    private authService: AuthService
  ) {}


  goToLinkAuthorizeConnect() {
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', '' + this.authService.currentUser.token)
    let options = new RequestOptions({ headers: headers, search: {}});
    return this.http.get(this.url + 'stripeConnect/goToLinkAuthorizeConnect/', options)
      .map((response: Response) => {
        return response.json();
      })
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

    deauthorizeConnect() {
      const body = ''
      // const body = JSON.stringify(params);
      const headers = new Headers({'Content-Type': 'application/json'});
      headers.append('Authorization', '' + this.authService.currentUser.token);
      return this.http.post(this.url + 'stripeConnect/deauthorizeConnect', body, {headers: headers})
        .map(response => response.json())
        .catch((error: Response) => {
          this.errorService.handleError(error.json());
          return Observable.throw(error.json());
        });
    }
    oauthConnect(params) {
      const body = JSON.stringify(params);
      const headers = new Headers({'Content-Type': 'application/json'});
      headers.append('Authorization', '' + this.authService.currentUser.token);
      return this.http.post(this.url + 'stripeConnect/oauthConnect', body, {headers: headers})
        .map(response => response.json())
        .catch((error: Response) => {
          this.errorService.handleError(error.json());
          return Observable.throw(error.json());
        });
    }

    payByCardConnect(fetchedPaiementQuoteId, card) {
      const body = JSON.stringify(card);
      const headers = new Headers({'Content-Type': 'application/json'});
      headers.append('Authorization', '' + this.authService.currentUser.token);
      return this.http.post(this.url + 'stripeConnect/payByCardConnect/' + fetchedPaiementQuoteId, body, {headers: headers})
        .map(response => response.json())
        .catch((error: Response) => {
          this.errorService.handleError(error.json());
          return Observable.throw(error.json());
        });
    }

    getUserInfosConnect() {
      let headers = new Headers({'Content-Type': 'application/json'});
      headers.append('Authorization', '' + this.authService.currentUser.token);
      return this.http.get(this.url + 'stripeConnect/getUserInfosConnect', {headers: headers})
        .map((response: Response) => {
          return response.json();
        })
        .catch((error: Response) => {
          return Observable.throw(error.json());
        });
      }
    getUserInfosConnectByCompanieId(companieId: string) {
      let headers = new Headers({'Content-Type': 'application/json'});
      headers.append('Authorization', '' + this.authService.currentUser.token);
      return this.http.get(this.url + 'stripeConnect/getUserInfosConnect/' + companieId , {headers: headers})
        .map((response: Response) => {
          return response.json();
        })
        .catch((error: Response) => {
          return Observable.throw(error.json());
        });
      }




      getStripeCust() {
        let headers = new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', '' + this.authService.currentUser.token);
        return this.http.get(this.url + 'paiement/getStripeCust', {headers: headers})
          .map((response: Response) => {
            return response.json();
          })
          .catch((error: Response) => {
            // this.errorService.handleError(error.json());
            return Observable.throw(error.json());
          });
      }
      getStripeCard() {
        let headers = new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', '' + this.authService.currentUser.token);
        return this.http.get(this.url + 'paiement/getStripeCard', {headers: headers})
          .map((response: Response) => {
            return response.json();
          })
          .catch((error: Response) => {
            this.errorService.handleError(error.json());
            return Observable.throw(error.json());
          });
      }
      getStripeSubscription(){
        let headers = new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', '' + this.authService.currentUser.token);
        return this.http.get(this.url + 'paiement/getStripeSubscription', {headers: headers})
          .map((response: Response) => {
            return response.json();
          })
          .catch((error: Response) => {
            this.errorService.handleError(error.json());
            return Observable.throw(error.json());
          });
      }

      deleteSub(subId){
        let headers = new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', '' + this.authService.currentUser.token);
        return this.http.delete(this.url + 'paiement/deleteSub/' + subId, {headers: headers})
          .map((response: Response) => {
            return response.json();
          })
          .catch((error: Response) => {
            this.errorService.handleError(error.json());
            return Observable.throw(error.json());
          });
      }
      deleteCard(cardId){
        let headers = new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', '' + this.authService.currentUser.token);
        return this.http.delete(this.url + 'paiement/deleteCard/' + cardId, {headers: headers})
          .map((response: Response) => {
            return response.json();
          })
          .catch((error: Response) => {
            this.errorService.handleError(error.json());
            return Observable.throw(error.json());
          });
      }
      deleteCustInStripe(){
        let headers = new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', '' + this.authService.currentUser.token);
        return this.http.delete(this.url + 'paiement/deleteCustInStripe', {headers: headers})
          .map((response: Response) => {
            return response.json();
          })
          .catch((error: Response) => {
            this.errorService.handleError(error.json());
            return Observable.throw(error.json());
          });
      }
      saveCustInStripe(){
        let companie
        const body = JSON.stringify(companie);
        const headers = new Headers({'Content-Type': 'application/json'});
      //  let headers = new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', '' + this.authService.currentUser.token);
        return this.http.post(this.url + 'paiement/saveCustInStripe', body, {headers: headers})
          .map(response => response.json())
          .catch((error: Response) => {
            this.errorService.handleError(error.json());
            return Observable.throw(error.json());
          });
      }
      saveCardInStripe(card) {
        const body = JSON.stringify(card);
        const headers = new Headers({'Content-Type': 'application/json'});
      //  let headers = new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', '' + this.authService.currentUser.token);
        return this.http.post(this.url + 'paiement/saveCardInStripe/', body, {headers: headers})
          .map(response => response.json())
          .catch((error: Response) => {
            this.errorService.handleError(error.json());
            return Observable.throw(error.json());
          });
      }
      saveSubscriptionInStripe(plan){
        const body = JSON.stringify(plan);
        const headers = new Headers({'Content-Type': 'application/json'});
      //  let headers = new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', '' + this.authService.currentUser.token);
        return this.http.post(this.url + 'paiement/saveSubscriptionInStripe', body, {headers: headers})
          .map(response => response.json())
          .catch((error: Response) => {
            this.errorService.handleError(error.json());
            return Observable.throw(error.json());
          });
      }


      //
      // getStripeCust(fetchedPaiementQuoteId) {
      //
      //   let headers = new Headers({'Content-Type': 'application/json'});
      //   headers.append('Authorization', '' + this.authService.currentUser.token)
      //   let options = new RequestOptions({ headers: headers, search: {}});
      //
      //   return this.http.get(this.url + 'paiement/getStripeCust/' + fetchedPaiementQuoteId, options)
      //     .map((response: Response) => {
      //       return response.json();
      //     })
      //     .catch((error: Response) => {
      //       // this.errorService.handleError(error.json());
      //       return Observable.throw(error.json());
      //     });
      // }
      //
      // getStripeAccountDetails() {
      //   let headers = new Headers({'Content-Type': 'application/json'});
      //   headers.append('Authorization', '' + this.authService.currentUser.token);
      //   return this.http.get(this.url + 'paiement/getStripeAccountDetails', {headers: headers})
      //     .map((response: Response) => {
      //       return response.json();
      //     })
      //     .catch((error: Response) => {
      //       this.errorService.handleError(error.json());
      //       return Observable.throw(error.json());
      //     });
      // }
      //
      //
      // getStripeCard() {
      //   let headers = new Headers({'Content-Type': 'application/json'});
      //   headers.append('Authorization', '' + this.authService.currentUser.token);
      //   return this.http.get(this.url + 'paiement/getStripeCard', {headers: headers})
      //     .map((response: Response) => {
      //       return response.json();
      //     })
      //     .catch((error: Response) => {
      //       this.errorService.handleError(error.json());
      //       return Observable.throw(error.json());
      //     });
      // }
      // getStripeSubscription(){
      //   let headers = new Headers({'Content-Type': 'application/json'});
      //   headers.append('Authorization', '' + this.authService.currentUser.token);
      //   return this.http.get(this.url + 'paiement/getStripeSubscription', {headers: headers})
      //     .map((response: Response) => {
      //       return response.json();
      //     })
      //     .catch((error: Response) => {
      //       this.errorService.handleError(error.json());
      //       return Observable.throw(error.json());
      //     });
      // }
      //
      // deleteSub(subId){
      //   let headers = new Headers({'Content-Type': 'application/json'});
      //   headers.append('Authorization', '' + this.authService.currentUser.token);
      //   return this.http.delete(this.url + 'paiement/deleteSub/' + subId, {headers: headers})
      //     .map((response: Response) => {
      //       return response.json();
      //     })
      //     .catch((error: Response) => {
      //       this.errorService.handleError(error.json());
      //       return Observable.throw(error.json());
      //     });
      // }
      // deleteCard(cardId, fetchedPaiementQuoteId){
      //   let headers = new Headers({'Content-Type': 'application/json'});
      //   headers.append('Authorization', '' + this.authService.currentUser.token);
      //   return this.http.delete(this.url + 'paiement/deleteCard/' + cardId + '/' + fetchedPaiementQuoteId, {headers: headers})
      //     .map((response: Response) => {
      //       return response.json();
      //     })
      //     .catch((error: Response) => {
      //       this.errorService.handleError(error.json());
      //       return Observable.throw(error.json());
      //     });
      // }
      // deleteCustInStripe(fetchedPaiementQuoteId){
      //   let headers = new Headers({'Content-Type': 'application/json'});
      //   headers.append('Authorization', '' + this.authService.currentUser.token);
      //   return this.http.delete(this.url + 'paiement/deleteCustInStripe/' + fetchedPaiementQuoteId, {headers: headers})
      //     .map((response: Response) => {
      //       return response.json();
      //     })
      //     .catch((error: Response) => {
      //       this.errorService.handleError(error.json());
      //       return Observable.throw(error.json());
      //     });
      // }
      // saveCustInStripe() {
      //   // let companie
      //   // const body = JSON.stringify(paiementQuote);
      //   const body = ''
      //   const headers = new Headers({'Content-Type': 'application/json'});
      // //  let headers = new Headers({'Content-Type': 'application/json'});
      //   headers.append('Authorization', '' + this.authService.currentUser.token);
      //   return this.http.post(this.url + 'paiement/saveCustInStripe', body, {headers: headers})
      //     .map(response => response.json())
      //     .catch((error: Response) => {
      //       this.errorService.handleError(error.json());
      //       return Observable.throw(error.json());
      //     });
      // }
      //
      //
      //
      // payInStripe(fetchedPaiementQuoteId, dataPayInStripe){
      //   const body = JSON.stringify(dataPayInStripe);
      //   const headers = new Headers({'Content-Type': 'application/json'});
      //   headers.append('Authorization', '' + this.authService.currentUser.token);
      //   return this.http.post(this.url + 'paiement/payInStripe/' + fetchedPaiementQuoteId, body, {headers: headers})
      //     .map(response => response.json())
      //     .catch((error: Response) => {
      //       this.errorService.handleError(error.json());
      //       return Observable.throw(error.json());
      //     });
      // }
      // saveCardInStripe(card){
      //   const body = JSON.stringify(card);
      //   const headers = new Headers({'Content-Type': 'application/json'});
      // //  let headers = new Headers({'Content-Type': 'application/json'});
      //   headers.append('Authorization', '' + this.authService.currentUser.token);
      //   return this.http.post(this.url + 'paiement/saveCardInStripe/', body, {headers: headers})
      //     .map(response => response.json())
      //     .catch((error: Response) => {
      //       this.errorService.handleError(error.json());
      //       return Observable.throw(error.json());
      //     });
      // }
      // saveSubscriptionInStripe(plan, fetchedPaiementQuoteId){
      //   const body = JSON.stringify(plan);
      //   const headers = new Headers({'Content-Type': 'application/json'});
      // //  let headers = new Headers({'Content-Type': 'application/json'});
      //   headers.append('Authorization', '' + this.authService.currentUser.token);
      //   return this.http.post(this.url + 'paiement/saveSubscriptionInStripe/' + fetchedPaiementQuoteId, body, {headers: headers})
      //     .map(response => response.json())
      //     .catch((error: Response) => {
      //       this.errorService.handleError(error.json());
      //       return Observable.throw(error.json());
      //     });
      // }


  //
  //
  // getStripeCust() {
  //   let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.authService.currentUser.token);
  //   return this.http.get(this.url + 'paiement/getStripeCust', {headers: headers})
  //     .map((response: Response) => {
  //       return response.json();
  //     })
  //     .catch((error: Response) => {
  //       // this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }
  // getStripeAccountDetails() {
  //   let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.authService.currentUser.token);
  //   return this.http.get(this.url + 'paiement/getStripeAccountDetails', {headers: headers})
  //     .map((response: Response) => {
  //       return response.json();
  //     })
  //     .catch((error: Response) => {
  //       // this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }
  //
  //
  // getStripeCard() {
  //   let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.authService.currentUser.token);
  //   return this.http.get(this.url + 'paiement/getStripeCard', {headers: headers})
  //     .map((response: Response) => {
  //       return response.json();
  //     })
  //     .catch((error: Response) => {
  //       this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }
  // getStripeSubscription(){
  //   let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.authService.currentUser.token);
  //   return this.http.get(this.url + 'paiement/getStripeSubscription', {headers: headers})
  //     .map((response: Response) => {
  //       return response.json();
  //     })
  //     .catch((error: Response) => {
  //       this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }
  //
  // deleteSub(subId){
  //   let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.authService.currentUser.token);
  //   return this.http.delete(this.url + 'paiement/deleteSub/' + subId, {headers: headers})
  //     .map((response: Response) => {
  //       return response.json();
  //     })
  //     .catch((error: Response) => {
  //       this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }
  // deleteCard(cardId){
  //   let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.authService.currentUser.token);
  //   return this.http.delete(this.url + 'paiement/deleteCard/' + cardId, {headers: headers})
  //     .map((response: Response) => {
  //       return response.json();
  //     })
  //     .catch((error: Response) => {
  //       this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }
  // deleteCustInStripe(){
  //   let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.authService.currentUser.token);
  //   return this.http.delete(this.url + 'paiement/deleteCustInStripe', {headers: headers})
  //     .map((response: Response) => {
  //       return response.json();
  //     })
  //     .catch((error: Response) => {
  //       this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }
  // saveCustInStripe(){
  //   let companie
  //   const body = JSON.stringify(companie);
  //   const headers = new Headers({'Content-Type': 'application/json'});
  // //  let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.authService.currentUser.token);
  //   return this.http.post(this.url + 'paiement/saveCustInStripe', body, {headers: headers})
  //     .map(response => response.json())
  //     .catch((error: Response) => {
  //       this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }
  //
  //
  //
  // payInStripe(payInStripeData){
  //   const body = JSON.stringify(payInStripeData);
  //   const headers = new Headers({'Content-Type': 'application/json'});
  // //  let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.authService.currentUser.token);
  //   return this.http.post(this.url + 'paiement/payInStripe/', body, {headers: headers})
  //     .map(response => response.json())
  //     .catch((error: Response) => {
  //       this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }
  // saveCardInStripe(card){
  //   const body = JSON.stringify(card);
  //   const headers = new Headers({'Content-Type': 'application/json'});
  // //  let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.authService.currentUser.token);
  //   return this.http.post(this.url + 'paiement/saveCardInStripe/', body, {headers: headers})
  //     .map(response => response.json())
  //     .catch((error: Response) => {
  //       this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }
  // saveSubscriptionInStripe(plan){
  //   const body = JSON.stringify(plan);
  //   const headers = new Headers({'Content-Type': 'application/json'});
  // //  let headers = new Headers({'Content-Type': 'application/json'});
  //   headers.append('Authorization', '' + this.authService.currentUser.token);
  //   return this.http.post(this.url + 'paiement/saveSubscriptionInStripe', body, {headers: headers})
  //     .map(response => response.json())
  //     .catch((error: Response) => {
  //       this.errorService.handleError(error.json());
  //       return Observable.throw(error.json());
  //     });
  // }



}
