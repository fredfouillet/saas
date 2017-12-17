import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {CompanieService} from '../companie.service';
// import {UserService} from '../../user/user.service';


import {Companie, Categorie0, ContactsPerson} from '../companie.model';
import {Address} from '../../shared/address/address.model';

import {ToastsManager} from 'ng2-toastr';

import {MatDialog } from '@angular/material';
import {Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

// import { DeleteDialog } from '../../deleteDialog/deleteDialog.component';
import { User } from '../../user/user.model';

// import { EditOptionsComponentDialog } from '../../form/modalLibrary/modalLibrary.component';
import { PaiementService} from './paiement/paiement.service';


@Component({
  selector: 'app-edit-companie',
  templateUrl: './companie.component.html',
  styleUrls: ['../companie.component.css'],
})
export class CompanieComponent implements OnInit {
  // @Output() saved: EventEmitter<any> = new EventEmitter();
  // @Input() showBackButton: Boolean = true;
  fetchedCompanie: Companie = new Companie()
  step = -1;
  // userAdmins : User[] = []
  // userManagers : User[] = []
  // userClients : User[] = []
  // usersSalesRep : User[] = []
  // userStylists : User[] = []
  myForm: FormGroup;
  // seeRights = false;
  seeCategProject = false;
  seeCategProduct = false;

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
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private _fb: FormBuilder,
    public authService: AuthService,
    // private userService: UserService,
    private paiementService: PaiementService,
  ) {}

  setStep(index: number) {
    this.step = index;
  }


  ngOnInit() {
    setTimeout(() => { this.step = 0});
    // if (!this.authService.isCurrentUserIsInSubPeriod()) {
    //   this.step = 1;
    // }
    // this.getStripeAccountDetails()
    // this.myForm = this._fb.group({
    //   nameCompanie: ['', [Validators.required, Validators.minLength(2)]],
    //   phoneNumber: [''],
    //   VAT: [''],
    //   isSupplier: [''],
    //   faxNumber: [''],
    //   email: [''],
    //   timeBegin: ['', [Validators.required, Validators.minLength(1)]],
    //   timeEnd: ['', [Validators.required, Validators.minLength(1)]],
    //   timeBeginbusinessHours: ['', [Validators.required, Validators.minLength(1)]],
    //   timeEndbusinessHours: ['', [Validators.required, Validators.minLength(1)]],
    //   slotDuration: [''],
    //   address: [''],
    //   city: [''],
    //   state: [''],
    //   zip: [''],
    //   country: [''],
    //   _users: this._fb.array([]),
    //   secretKey:[''],
    //   serviceSelected:[''],
    // })



    // this.paiementService.oauthIsConnectedConnect()
    // .subscribe( res => { console.log(res) }, error => { console.log(error) } )


    this.activatedRoute.queryParamMap.subscribe((params: Params)  => {
        // console.log(params.params)
        if(params.params.scope === 'read_write' && params.params.code) {
          this.paiementService.oauthConnect(params.params)
          .subscribe( res => {
            // console.log(res)
            this.fetchedCompanie = res.obj
          }, error => { console.log(error) } )
        }
      })



    // this.getCurrentUser()
    this.activatedRoute.params.subscribe((params: Params) => {
      /*console.log(params)*/
      if(params['id']) {
        if(params['id'] === 'mine') {
          this.getCompanie('')


        } else {
          this.getCompanie(params['id'])
        }
      }
    })
  }
  nextStep() {
    this.step++
  }
  saveAndNextStep() {
    this.nextStep()
    this.save()
  }

    save() {
      //this.fetchedCompanie.categJson.categProduct = JSON.stringify(JSON.parse(this.fetchedCompanie.categJson.categProduct))
      if(this.fetchedCompanie._id) {
        this.companieService.updateCompanie(this.fetchedCompanie)
          .subscribe(
            res => {
              this.toastr.success('Great!', res.message)
              // this.saved.emit(res.obj)
            //  this.router.navigate(['companie/' + this.fetchedCompanie._id])
            },
            error => {
              this.toastr.error('error!', error)
            }
          )
      } else {
        this.companieService.saveCompanie(this.fetchedCompanie)
          .subscribe(
            res => {
              this.toastr.success('Great!', res.message)
              this.fetchedCompanie = res.obj
              // this.saved.emit(res.obj)
              //  this.router.navigate(['companie/' + res.obj._id])
            },
            error => {console.log(error)}
          )
      }
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
  //   const newAddress = new Address()
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
  // addCateg(typeCateg, level, index1, index2, index3) {
  //     let newCategorie = new Categorie0()
  //     if(level === 0)
  //       this.fetchedCompanie.categories[typeCateg].unshift(newCategorie)
  //     if(level === 1)
  //       this.fetchedCompanie.categories[typeCateg][index1].subCateg.unshift(newCategorie)
  //     if(level === 2)
  //       this.fetchedCompanie.categories[typeCateg][index1].subCateg[index2].subCateg.unshift(newCategorie)
  //
  // }
  // removeTypeUser(i) {
  //   this.fetchedCompanie.typeUsers.splice(i, 1)
  // }

  onDelete(id: string) {
    this.companieService.deleteCompanie(id)
      .subscribe(
        res => {
          this.toastr.success('Great!', res.message);
          this.router.navigate(['companie/'])
          console.log(res);
        },
        error => {
          console.log(error);
        }
      );
  }

  // goBack() {
  //   this.location.back();
  // }


  isMyCompanie() {
    const currentUser = this.authService.getCurrentUser()
    return currentUser.ownerCompanies.some(obj => {
      return obj._id === this.fetchedCompanie._id
    })
  }
  getCompanie(id: string) {
    this.companieService.getCompanie(id, {})
      .subscribe(
        res => {
          this.fetchedCompanie = res
        },
        error => {
          console.log(error);
        }
      )
  }


}
