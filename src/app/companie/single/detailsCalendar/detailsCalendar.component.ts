import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';
import {CompanieService} from '../../companie.service';
// import {UserService} from '../../user/user.service';


import {Companie, ContactsPerson} from '../../companie.model';

import {Address} from '../../../shared/address/address.model';
import {ToastsManager} from 'ng2-toastr';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-details-calendar',
  templateUrl: './detailsCalendar.component.html',
  styleUrls: ['../../companie.component.css'],
})
export class DetailsCalendarComponent implements OnInit, OnChanges {
  @Output() saveEmit: EventEmitter<any> = new EventEmitter();
  // @Input() showBackButton: Boolean = true;
  @Input() fetchedCompanie: Companie = new Companie()

  daysToHideTemp: any = [true, true, true, true, true, true, true]

  showLoginInApp: boolean = false
  // userAdmins : User[] = []
  // userManagers : User[] = []
  // userClients : User[] = []
  // usersSalesRep : User[] = []
  // userStylists : User[] = []
  myForm: FormGroup;
  // seeRights = false;
  // seeCategProject = false;
  // seeCategProduct = false;
  // isMyCompanyRoute: Boolean = false
  // servicesBancks = ['stripe', 'paypal']
  // typesRights = [
  //   {name : 'Project', value: 'project'},
  //   {name : 'Quote', value: 'qute'},
  //   {name : 'Reporting', value: 'reporting'},
  // ]
  constructor(
    private companieService: CompanieService,
//    private modalService: NgbModal,
    private toastr: ToastsManager,
    // public dialog: MatDialog,
    // private activatedRoute: ActivatedRoute,
    private router: Router,
    // private location: Location,
    private _fb: FormBuilder,
    private authService: AuthService,
    // private userService: UserService,
    // private paiementService: PaiementService,
  ) {}

  ngOnChanges() {
    // console.log(this.fetchedCompanie.option.calendar.daysToHide)
    this.fetchedCompanie.option.calendar.daysToHide.forEach(day => {
      this.daysToHideTemp[day] = false
    })
  }

  ngOnInit() {


    // this.fetchedCompanie.option.calendar.daysToHide = []
    // for (let i = 0; i < 6 ; i++) {
    //   if (this.daysToHideTemp[i]) { this.fetchedCompanie.option.calendar.daysToHide.push(i) }
    // }

    // console.log(this.fetchedCompanie.option.calendar.daysToHide)
      // this.fetchedCompanie.option.calendar.daysToHide.forEach((day, i) => {
      //   this.daysToHideTemp[day] = true
      // })
    // this.getStripeAccountDetails()
    this.myForm = this._fb.group({
      nameCompanie: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: [''],
      VAT: [''],
      isSupplier: [''],
      faxNumber: [''],
      email: [''],
      timeBegin: ['', [Validators.required, Validators.minLength(1)]],
      timeEnd: ['', [Validators.required, Validators.minLength(1)]],
      timeBeginbusinessHours: ['', [Validators.required, Validators.minLength(1)]],
      timeEndbusinessHours: ['', [Validators.required, Validators.minLength(1)]],
      slotDuration: [''],
      address: [''],
      city: [''],
      state: [''],
      zip: [''],
      country: [''],
      _users: this._fb.array([]),
      secretKey:[''],
      serviceSelected:[''],
    })


    // this.paiementService.oauthIsConnectedConnect()
    // .subscribe( res => { console.log(res) }, error => { console.log(error) } )

    //
    // this.activatedRoute.queryParamMap.subscribe((params: Params)  => {
    //     console.log(params.params)
    //     if(params.params.scope === 'read_write' && params.params.code) {
    //       this.paiementService.oauthConnect(params.params)
    //       .subscribe( res => {
    //         console.log(res)
    //         this.fetchedCompanie = res.obj
    //       }, error => { console.log(error) } )
    //     }
    //   })
    //
    //
    //
    // // this.getCurrentUser()
    // this.activatedRoute.params.subscribe((params: Params) => {
    //   /*console.log(params)*/
    //   if(params['id']) {
    //     if(params['id'] === 'mine') {
    //       this.getCompanie('')
    //       // this.isMyCompanyRoute = true
    //
    //     } else {
    //       this.getCompanie(params['id'])
    //     }
    //   }
    // })
  }

  changeDay () {
    this.dataChanged()
    this.fetchedCompanie.option.calendar.daysToHide = []
    for (let i = 0; i < 7 ; i++) {
      if (!this.daysToHideTemp[i]) { this.fetchedCompanie.option.calendar.daysToHide.push(i) }
    }

  }

  dataChanged() {
    this.save()
    this.showLoginInApp = true
  }


  //
  // deauthorizeConnect() {
  //   this.paiementService.deauthorizeConnect()
  //   .subscribe( res => {
  //     this.fetchedCompanie = res.obj
  //   }, error => { console.log(error) } )
  // }
  // goToLinkAuthorizeConnect(){
  //   this.paiementService.goToLinkAuthorizeConnect()
  //   .subscribe( res => {
  //     window.location.href=res.url;
  //   }, error => { console.log(error) } )
  // }
  // addTypeUser() {
  //   this.fetchedCompanie.typeUsers.push({value: ''})
  // }
  // getStripeAccountDetails() {
  //   // this.paiementService.getStripeCust()
  //   //   .subscribe(
  //   //     res => {
  //   //       console.log(res)
  //   //     },
  //   //     error => { console.log(error) }
  //   //   )
  // }

  // newAddress() {
  //   let newAddress = new Address()
  //   this.fetchedCompanie.address.push(newAddress)
  // }
  // removeAddress(i) {
  //   this.fetchedCompanie.address.splice(i, 1);
  // }
  // newContact() {
  //   const newContact = new ContactsPerson()
  //   this.fetchedCompanie.contactsPerson.push(newContact)
  // }
  // removeContact(i) {
  //   this.fetchedCompanie.contactsPerson.splice(i, 1);
  // }
  // isMyCompanie() {
  //   const currentUser = this.authService.getCurrentUser()
  //   // console.log(currentUser)
  //   return currentUser.ownerCompanies.some(obj => {
  //     return obj._id === this.fetchedCompanie._id
  //   })
  //
  // }


  save() {

    this.saveEmit.emit()
  }

  // save() {
  //
  //   //this.fetchedCompanie.categJson.categProduct = JSON.stringify(JSON.parse(this.fetchedCompanie.categJson.categProduct))
  //   if(this.fetchedCompanie._id) {
  //     this.companieService.updateCompanie(this.fetchedCompanie)
  //       .subscribe(
  //         res => {
  //           this.toastr.success('Great!', res.message)
  //           this.saved.emit(res.obj)
  //         //  this.router.navigate(['companie/' + this.fetchedCompanie._id])
  //         },
  //         error => {
  //           this.toastr.error('error!', error)
  //         }
  //       )
  //   } else {
  //     this.companieService.saveCompanie(this.fetchedCompanie)
  //       .subscribe(
  //         res => {
  //           this.toastr.success('Great!', res.message)
  //           this.fetchedCompanie = res.obj
  //           this.saved.emit(res.obj)
  //           //  this.router.navigate(['companie/' + res.obj._id])
  //         },
  //         error => {console.log(error)}
  //       )
  //   }
  // }
  // saveMyCompanie(){
  //   this.companieService.saveMyCompanie(this.fetchedCompanie)
  //     .subscribe(
  //       res => {
  //         this.toastr.success('Great!', res.message)
  //         this.fetchedCompanie = res.obj
  //       },
  //       error => {console.log(error)}
  //     )
  // }





}
