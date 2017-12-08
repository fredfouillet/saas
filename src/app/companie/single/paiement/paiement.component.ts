import { Component, OnInit} from '@angular/core';
import { AuthService} from '../../../auth/auth.service';
import { UserService} from '../../../user/user.service';
import { PaiementService} from './paiement.service';

import { ToastsManager} from 'ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { User } from '../../../user//user.model';
import { Quote } from '../../../quote/quote.model';
import { StripeCustomer, DataSource } from './paiement.model';
import { Companie } from '../../../companie/companie.model';
import { FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';



@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.css'],

})


export class PaiementComponent implements OnInit {
  //fetchedUser = new User()
  //fetchedUser : User;
  // isUserBelongToHQ=false
  // maxPictureToShow=3;
  // instapic=1;
  plan: string = ''
  loading: boolean = false
  // companies: Companie[] = [];
  // isEditMode:boolean = false
  showReLoginInApp:boolean = false
  newCard: DataSource = new DataSource()
  // fetchedUser : User = new User()
  stripeCust: StripeCustomer = new StripeCustomer()

  quotes: Quote[] = []
  // public myForm: FormGroup;

  constructor(
    private userService: UserService,
    private paiementService: PaiementService,
    private toastr: ToastsManager,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private authService: AuthService
  ) {}

  step = 0;

  changePlan() {
    this.nextStep()
  }
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ngOnInit() {
    this.getStripeCust();
  }
  loginInAppDone() {
    this.showReLoginInApp = false
  }

  getStripeCust() {
    this.loading = true
    this.paiementService.getStripeCust()
      .subscribe(
        res => {
          // console.log(res)
          // if(res.customer.deleted) {
          //   this.stripeCust = new StripeCustomer()
          // } else {
            this.stripeCust = res.customer
            this.stripeCust.subscriptions.data.forEach(dataSubscription => {
              this.plan = dataSubscription.plan.id
            })
            this.loading = false


          // }

        },
        error => {
          this.stripeCust = new StripeCustomer()
          this.loading = false
          console.log(error)
        }
      )
  }

  // selectQuote(quote){
  //   this.quotes = [quote]
  // }


  deleteCustInStripe() {
    this.loading = true
    this.paiementService.deleteCustInStripe()
      .subscribe(
        res => {
          // this.userService.cleanCurrentUserInSession()
          this.toastr.success('Great!')
          this.getStripeCust()
          this.showReLoginInApp = true
          this.setStep(4)
          this.loading = false
        },
        error => { console.log(error); }
      );
  }
  saveCustInStripe(){
    this.loading = true
    this.paiementService.saveCustInStripe()
      .subscribe(
        res => {
          // this.userService.cleanCurrentUserInSession()
          this.toastr.success('Great!')
          this.stripeCust = res.customer
          // console.log(res);
          this.nextStep()
          this.loading = false
        },
        error => { console.log(error); }
      );
  }
  saveCardInStripe() {
    this.loading = true
    // console.log(this.newCard)
    this.paiementService.saveCardInStripe(this.newCard)
      .subscribe(
        res => {
          // this.userService.cleanCurrentUserInSession()
          this.toastr.success('Great!')
          this.getStripeCust()
          this.nextStep()
          this.loading = false
          // console.log(res);
        },
        error => {
          this.loading = false
          console.log(error);
        }
      );
  }
  saveSubscriptionInStripe() {
    this.loading = true
    const planObj = {
      plan: this.plan
    }
    this.paiementService.saveSubscriptionInStripe(planObj)
      .subscribe(
        res => {
          // this.userService.cleanCurrentUserInSession()
          this.toastr.success('Great!')
          this.getStripeCust()
          this.showReLoginInApp = true
          this.nextStep()
          this.loading = false
        },
        error => {
          this.loading = false
          console.log(error);
        }
      );
  }


  deleteSubInStripe(subId){
    this.loading = true
    this.paiementService.deleteSub(subId)
      .subscribe(
        res => {
          // this.userService.cleanCurrentUserInSession()
          // console.log(res.message)
          this.toastr.success('Great!');
          this.getStripeCust()
          this.setStep(4)
          this.showReLoginInApp = true
          this.plan = ''
          this.loading = false
          // this.getStripeCust()
          // location.reload();
        },
        error => {
          console.log(error);
        }
      );
  }

  deleteCardInStripe(cardId) {
    this.paiementService.deleteCard(cardId)
      .subscribe(
        res => {
          // this.userService.cleanCurrentUserInSession()
          this.toastr.success('Great!');
          this.getStripeCust()
        },
        error => {
          console.log(error);
        }
      );

  }


  //
  //
  //
  //
  //
  // getUser(id: string) {
  //   this.userService.getUser(id)
  //     .subscribe(
  //       res => { this.fetchedUser = res },
  //       error => { console.log(error) }
  //     )
  // }




  //
  // goBack() {
  //   this.location.back();
  // }
  //






  // save() {
  //   // this.isEditMode = false
  //   this.userService.updateUser(this.fetchedUser)
  //     .subscribe(
  //       res => {
  //         this.toastr.success('Great!', res.message)
  //       },
  //       error => {console.log(error)}
  //     )
  // }



  //
  // isAdmin() {
  //   return this.authService.isAdmin();
  // }
  //
  // isMyProfile() {
  //   if(this.fetchedUser._id === this.authService.currentUser.userId)
  //     return true
  //   return false
  // }


  // onDelete(id: string) {
  //   this.userService.deleteUser(id)
  //     .subscribe(
  //       res => {
  //         this.toastr.success('Great!', res.message);
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  // }



}
