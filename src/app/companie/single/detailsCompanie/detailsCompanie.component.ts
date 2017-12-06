import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';
import {CompanieService} from '../../companie.service';
// import {UserService} from '../../user/user.service';


import {Companie, ContactsPerson} from '../../companie.model';
// import {Companie, Categorie0, ContactsPerson} from '../companie.model';
import {Address} from '../../../user/user.model';

import {ToastsManager} from 'ng2-toastr';

// import {MatDialog } from '@angular/material';
import {Router} from '@angular/router';
// import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

// import { DeleteDialog } from '../../../deleteDialog/deleteDialog.component';
// import { User } from '../../user/user.model';

// import { EditOptionsComponentDialog } from '../../form/modalLibrary/modalLibrary.component';
// import { PaiementService} from '../paiement/paiement.service';


@Component({
  selector: 'app-detailsCompanie',
  templateUrl: './detailsCompanie.component.html',
  styleUrls: ['../../companie.component.css'],
})
export class DetailsCompanieComponent implements OnInit {
  @Output() saved: EventEmitter<any> = new EventEmitter();
  // @Input() showBackButton: Boolean = true;
  @Input() fetchedCompanie: Companie = new Companie()

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

  ngOnInit() {
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
  getStripeAccountDetails() {
    // this.paiementService.getStripeCust()
    //   .subscribe(
    //     res => {
    //       console.log(res)
    //     },
    //     error => { console.log(error) }
    //   )
  }

  newAddress() {
    const newAddress = new Address()
    this.fetchedCompanie.address.push(newAddress)
  }
  removeAddress(i) {
    this.fetchedCompanie.address.splice(i, 1);
  }
  newContact() {
    const newContact = new ContactsPerson()
    this.fetchedCompanie.contactsPerson.push(newContact)
  }
  removeContact(i) {
    this.fetchedCompanie.contactsPerson.splice(i, 1);
  }


}
