import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {PaiementQuoteService} from '../paiementQuote.service';
import {PaiementService} from '../../companie/single/paiement/paiement.service';
import { AccountConnectStripe} from '../../companie/single/connectStripe/connectStripe.model'
import {PaiementQuote, StripeCustomer, DataSource} from '../paiementQuote.model';
import {ToastsManager} from 'ng2-toastr';
import {Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup} from '@angular/forms';
import { UserService} from '../../user/user.service';
import { QuoteService } from '../../quote/quote.service';
import { DeleteDialogComponent } from '../../nav/deleteDialog/deleteDialog.component';
import { User, UserCross, TypeUser, Address, AddressTypes } from '../../user/user.model';
import { Quote } from '../../quote/quote.model';
import { Product } from '../../product/product.model';
import { Search} from '../../shared/shared.model'
import {MatDialog } from '@angular/material';
// import { Location } from '@angular/common';
// import {ProductService} from '../../product/product.service';
// import { ProjectService} from '../../project/project.service';
// import {AuthService} from '../../auth/auth.service';
// import { Project } from '../../project/project.model';





@Component({
  selector: 'app-paiementQuote',
  templateUrl: './editPaiementQuote.component.html',
  styleUrls: ['../paiementQuote.component.css'],
})
export class EditPaiementQuoteComponent implements OnInit {
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() fetchedQuotes: Quote[] = []
  @Input() search: Search = new Search()
  @Input() isDialog: boolean = false
  showPaiements: boolean = false
  fetchedPaiementQuote: PaiementQuote = new PaiementQuote()
  fetchedProducts: Product[] = []
  stripeCust: StripeCustomer = new StripeCustomer()
  accountConnectStripe: AccountConnectStripe = new AccountConnectStripe();
  newCard: DataSource = new DataSource()
  fetchedUserCross: UserCross = new UserCross();
  myForm: FormGroup;
  autocompleteProduct: String = ''
  step = -1;
  paiementsTypes = [
    { label: 'cheque', value: 'check' },
    { label: 'Espece', value: 'cash' },
  ]
  // arrayContentToSearch = []
  // fetchedUsers: User[] = [];
  // autocompleteUser: string = '';
  // autocompleteProject: string = '';
  // fetchedProjects: Project[] = []
  // currentUser: User = new User()
  // imgLogoUrl: string = './assets/images/profile-placeholder.jpg'
  // imgSignatureBase64Temp = ''
  // showReLoginInApp:boolean = false
  // userAdmins : User[] = []
  // userManagers : User[] = []
  // userClients : User[] = []
  // usersSalesRep : User[] = []
  // userStylists : User[] = []

  constructor(
    private paiementQuoteService: PaiementQuoteService,
    private paiementService: PaiementService,
    private quoteService: QuoteService,
    private toastr: ToastsManager,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _fb: FormBuilder,
    private userService: UserService,
    // private projectService: ProjectService,
    // private productService: ProductService,
//    private modalService: NgbModal,
    // private location: Location,
    // private authService: AuthService,
  ) {}


 setStep(index: number) {
   this.step = index;
 }

 getUserInfosConnectStripe(){
   this.fetchedPaiementQuote.ownerCompanies.forEach(companieId => {
    //  console.log(companieId.toString())
     this.paiementService.getUserInfosConnectByCompanieId(companieId.toString())
       .subscribe(res => {
        //  this.paiementsTypes.push({label: 'Stripe', value: 'stripe' })
         this.accountConnectStripe = res.customer
       }, error => { console.log(error) })
   })
 }

 closeDialog() {
   this.save()
   this.close.emit()
 }
  ngOnInit() {
    setTimeout(() => { this.step = 0});
    this.myForm = this._fb.group({
      amount: [''],
      title: [''],
      isPaid: [false],
      type: [''],
      datePaiement: [ null, []],
    })

    // this.fetchedPaiementQuote
    // .datePaiementString =
    // this.authService
    // .isoDateToHtmlDate(this.fetchedPaiementQuote.datePaiement)

    this.fetchedPaiementQuote.isExpense = this.search.isExpense
    this.activatedRoute.params.subscribe((params: Params) => {
    //   if(params['isExpense']) {this.fetchedPaiementQuote.isExpense = true}
    //   if(params['isGooplusPaiement']) {this.fetchedPaiementQuote.isGooplusPaiement = true}
      if(params['idPaiementQuote']) {
        this.getPaiementQuote(params['idPaiementQuote'])
      }
    //   if(params['idQuote']) {this.getQuote(params['idQuote'])}
    })
  }

  // autocompleteAfterNgChanges(result) {
  //   this.fetchedPaiementQuote.quotes.forEach((quote: Quote) => {
  //     this.fetchedPaiementQuote.amount = Math.round(quote.priceQuote.priceGlobalWithDiscountWithSurface)
  //   })
  // }
  // getPdf() {
  //   alert('soon')
  // }
    selectQuote(quote: Quote) {

      // console.log(quote.priceQuote.priceGlobalWithDiscountWithSurface)
      this.fetchedPaiementQuote.quotes = [quote]
      this.search.quoteId = quote._id

    }
    // selectProject(project: Project) {
    //   this.fetchedPaiementQuote.projects = [project]
    // }
    selectUserDebited(user: User) {
      this.fetchedPaiementQuote.userDebiteds = [user]
      this.search.userId = user._id
      // this.getUserCross(user._id)
    }

    getUserCross(id: string) {
      this.userService.getUserCross(id)
        .subscribe(
          res => {

            this.fetchedUserCross = res
            this.fetchedUserCross.profile.address.forEach(singleAddress => {
              this.newCard.address_city = singleAddress.city
              this.newCard.address_line1 = singleAddress.address
              this.newCard.address_line2 = singleAddress.address2
              this.newCard.address_country = singleAddress.country
              this.newCard.address_zip = singleAddress.zip
              this.newCard.address_state = singleAddress.state
            })
          },
          error => {
            console.log(error);
          }
        )
    }
    autocompleteAfterNgChangesUser(user: User) {

      this.getUserCross(user._id)
      // this.selectUserDebited(user)
    }

    autocompleteAfterNgChanges(quote: Quote) {

      if(!this.fetchedPaiementQuote._id) {
        this.fetchedPaiementQuote.amount = Math.round(quote.priceQuote.priceGlobalWithTaxesWithDiscountWithSurfaceWithPainfulness)
      }
      // console.log(this.fetchedPaiementQuote.quotes)
    }
    // downloadPDF() {
    //   this.paiementQuoteService.downloadPDF(this.fetchedPaiementQuote._id)
    //     .subscribe(
    //       res => {
    //         console.log(res)
    //          window.open( '/uploads/pdf/' + res );
    //       },
    //       error => { console.log(error) }
    //     )
    // }

    getQuote(idQuote: string) {
      this.quoteService.getQuote(idQuote)
        .subscribe(
          res => {
            this.fetchedPaiementQuote.quotes = [res]
          },
          error => { console.log(error) }
        )
    }

  save() {
    let this2=this
    return new Promise(function(resolve, reject) {
      // this2.fetchedPaiementQuote
      // .datePaiement = this2.authService
      // .HTMLDatetoIsoDate(this2.fetchedPaiementQuote.datePaiementString)

      if(this2.fetchedPaiementQuote._id) {
        this2.paiementQuoteService.updatePaiementQuote(this2.fetchedPaiementQuote)
          .subscribe(
            res => {
              this2.toastr.success('Great!', res.message)
              // this2.saved.emit()
              this2.getPaiementQuote(res.obj._id)
              resolve(true)
              //this.router.navigate(['paiementQuote/edit/' + this.fetchedPaiementQuote._id])
            },
            error => {
              reject(true)
              this2.toastr.error('error!', error)
            }
          )
      } else {
        this2.paiementQuoteService.savePaiementQuote(this2.fetchedPaiementQuote)
          .subscribe(
            res => {
              this2.toastr.success('Great!', res.message)
              // this2.saved.emit()
              this2.getPaiementQuote(res.obj._id)
              // if(this.showHeader)
              //   this.router.navigate(['paiementQuote/edit/' + res.obj._id])
            },
            error => {console.log(error)}
          )
      }

    })
  }





  onDelete(id: string) {
    let this2 = this
    return new Promise(function(resolve, reject) {
      this2.paiementQuoteService.deletePaiementQuote(id)
        .subscribe(
          res => {
            this2.toastr.success('Great!', res.message);
            resolve(res)
          },
          error => {
            console.log(error);
            reject(error)
          }
        )
      })
  }


  openDialogDelete() {
    const this2 = this
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent)
    dialogRefDelete.afterClosed().subscribe(result => {
      if (result) {
        this.onDelete(this.fetchedPaiementQuote._id).then(function(){
          this2.router.navigate(['paiementQuote/list']);
        })
      }
    })
  }




  getPaiementQuote(id: string) {
    this.paiementQuoteService.getPaiementQuote(id, {})
      .subscribe(
        res => {
          this.fetchedPaiementQuote = res
          this.getUserInfosConnectStripe()
          // if(this.fetchedPaiementQuote.type === 'stripe')
          //   this.getStripeCust()
          // this.fetchedPaiementQuote
          // .datePaiementString = this.authService
          // .isoDateToHtmlDate(this.fetchedPaiementQuote.datePaiement)
        },
        error => {
          console.log(error);
        }
      )
  }
  // isAdmin() {
  //   return this.authService.isAdmin();
  // }


    //
    // getStripeCust() {
    //   // this.paiementService.getStripeCust(this.fetchedPaiementQuote._id)
    //   //   .subscribe(
    //   //     res => {
    //   //       // console.log(res)
    //   //
    //   //       this.stripeCust = res.customer
    //   //
    //   //
    //   //     },
    //   //     error => {
    //   //       this.stripeCust = new StripeCustomer()
    //   //       console.log(error)
    //   //     }
    //   //   )
    // }

    // payInStripe() {
    //     // // this.save().then(() => {
    //     //
    //     //   let dataPayInStripe = {
    //     //     amount: this.fetchedPaiementQuote.amount
    //     //   }
    //     //   console.log(dataPayInStripe)
    //     //   this.paiementService.payInStripe(this.fetchedPaiementQuote._id, dataPayInStripe)
    //     //     .subscribe(
    //     //       res => {
    //     //         // this.userService.cleanCurrentUserInSession()
    //     //         this.toastr.success('Great!')
    //     //         // this.getStripeCust()
    //     //         this.getPaiementQuote(this.fetchedPaiementQuote._id)
    //     //         // console.log(res);
    //     //       },
    //     //       error => { console.log(error); }
    //     //     );
    //     // // })
    //     // // .catch(err => {
    //     // //   console.log(err)
    //     // // })
    // }

    // deleteCustInStripe() {
    //   // this.paiementService.deleteCustInStripe(this.fetchedPaiementQuote._id)
    //   //   .subscribe(
    //   //     res => {
    //   //       // this.userService.cleanCurrentUserInSession()
    //   //       this.toastr.success('Great!')
    //   //       this.getStripeCust()
    //   //     },
    //   //     error => { console.log(error); }
    //   //   );
    // }
    nextStep() {
      this.step++
      this.save()
    }
    payByCardConnect() {
      this.save().then(() => {
        this.paiementService.payByCardConnect(this.fetchedPaiementQuote._id, this.newCard)
          .subscribe(
            res => {
              // this.userService.cleanCurrentUserInSession()
              this.toastr.success('Great!')
              // console.log(res)
              this.save()
              // this.getStripeCust()
            },
            error => {
            //   this.toastr.error(error)
            // console.log(error);
            }
          );
        })
    }
    // saveCustInStripe() {
    //   // this.paiementService.saveCustInStripe(this.fetchedPaiementQuote)
    //   //   .subscribe(
    //   //     res => {
    //   //       // this.userService.cleanCurrentUserInSession()
    //   //       this.toastr.success('Great!')
    //   //       this.stripeCust = res.customer
    //   //       console.log(res);
    //   //     },
    //   //     error => { console.log(error); }
    //   //   );
    // }
    //
    // saveCardInStripe() {
    //   // console.log(this.newCard)
    //   // this.paiementService.saveCardInStripe(this.newCard, this.fetchedPaiementQuote._id)
    //   //   .subscribe(
    //   //     res => {
    //   //       // this.userService.cleanCurrentUserInSession()
    //   //       this.toastr.success('Great!')
    //   //       this.getStripeCust()
    //   //       // console.log(res);
    //   //     },
    //   //     error => { console.log(error); }
    //   //   );
    // }
    // saveSubscriptionInStripe(planValue) {
    //   // let plan = {
    //   //   plan: planValue
    //   // }
    //   // this.paiementService.saveSubscriptionInStripe(plan, this.fetchedPaiementQuote._id)
    //   //   .subscribe(
    //   //     res => {
    //   //       // this.userService.cleanCurrentUserInSession()
    //   //       this.toastr.success('Great!')
    //   //       this.getStripeCust()
    //   //       this.showReLoginInApp = true
    //   //
    //   //
    //   //       // this.getStripeCust()
    //   //       // this.authService.refreshCookiesOfCurrentUser()
    //   //       // location.reload();
    //   //       // console.log(res);
    //   //     },
    //   //     error => { console.log(error); }
    //   //   );
    // }

    //
    // deleteSubInStripe(subId){
    //   // this.paiementService.deleteSub(subId)
    //   //   .subscribe(
    //   //     res => {
    //   //       // this.userService.cleanCurrentUserInSession()
    //   //       // console.log(res.message)
    //   //       this.toastr.success('Great!');
    //   //       this.getStripeCust()
    //   //       // this.getStripeCust()
    //   //       // location.reload();
    //   //     },
    //   //     error => {
    //   //       console.log(error);
    //   //     }
    //   //   );
    // }

    // deleteCardInStripe(cardId){
    //   // this.paiementService.deleteCard(cardId, this.fetchedPaiementQuote._id)
    //   //   .subscribe(
    //   //     res => {
    //   //       // this.userService.cleanCurrentUserInSession()
    //   //       this.toastr.success('Great!');
    //   //       this.getStripeCust()
    //   //     },
    //   //     error => {
    //   //       console.log(error);
    //   //     }
    //   //   );
    // }




}
