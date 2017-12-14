import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { ProductService} from '../product.service';
import { ToastsManager} from 'ng2-toastr';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Product, ItemSteps } from '../product.model';
import { Companie } from '../../companie/companie.model';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DeleteDialogComponent } from '../../nav/deleteDialog/deleteDialog.component';
import { User } from '../../user/user.model';
import { ModelVATs } from '../../quote/quote.model';
import { AuthService} from '../../auth/auth.service';
// import { CompanieService} from '../../companie/companie.service';
// import { Location } from '@angular/common';
// import { DomSanitizer } from '@angular/platform-browser';
// import { UserService } from '../../user/user.service';


@Component({
  selector: 'app-product-single',
  templateUrl: './productSingle.component.html',
  styleUrls: ['../product.component.css'],

})

export class ProductSingleComponent implements OnInit {
  @Input() isDialog: boolean = false;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  selectedIndex0: number = -1
  selectedIndex1: number = -1
  selectedIndex2: number = -1
  // selectedIndex1 = 0
  // selectedIndex2 = 0
  // show1 = false
  // show2 = false
  // categ1: string = '';
  // categ2: string = '';
  // categ3: string = '';
  itemSteps = ItemSteps;
  step = 0;

  VATs = ModelVATs;

  // autocompleteCompanie: string = '';

  // fetchedCurrentUser: User = new User()
  fetchedProduct: Product = new Product();
  public myForm: FormGroup;

  constructor(
    // private userService: UserService,
    // private sanitizer: DomSanitizer,
    private productService: ProductService,
    private toastr: ToastsManager,
    public dialog: MatDialog,
    private router: Router,
    // private location: Location,
    private activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    // private companieService: CompanieService,
    private authService: AuthService,
  ) {
  }




  ngOnInit() {
    this.myForm = this._fb.group({


        referenceName: ['', [Validators.required, Validators.minLength(2)]],
        reference: [''],
        description: [''],
        unit: [''],

        costPrice: [''],
        sellingPrice: [''],
        vat: [],

        height: [''],
        width: [''],
        depth: [''],


    })

    this.getItemSteps();

    this.activatedRoute.params.subscribe((params: Params) => {
      if(params['id']) {
        this.getProduct(params['id'])
      }
    })

  }

  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }

  saveAndNextStep() {
    this.save();
    this.nextStep();
  }
  saveAndNextStepAndClose() {
    this.nextStep()
    this.save().then(res => {
      this.saved.emit(res);
    })
  }

  getItemSteps() {
    const currentUser = this.authService.getCurrentUser()

    for (let i in currentUser.ownerCompanies) {
      if(currentUser.ownerCompanies[i].categories.categProduct) {
        this.itemSteps = currentUser.ownerCompanies[i].categories.categProduct
      }
    }

  }

  // removePic(i) {
  //   this.fetchedProduct.forms.splice(i, 1);
  // }
  // changeCascade(selectedIndex1, selectedIndex2) {
  //   this.selectedIndex1 = selectedIndex1
  //   this.selectedIndex2 = selectedIndex2
  // }
  changeCascade(selectedIndex0, selectedIndex1, selectedIndex2) {
    this.selectedIndex0 = selectedIndex0
    this.selectedIndex1 = selectedIndex1
    this.selectedIndex2 = selectedIndex2
  }

  //
  // searchCompanies() {
  //   if(!this.autocompleteCompanie) {
  //     this.fetchedCompanies = []
  //   } else {
  //     let search = {
  //         search: this.autocompleteCompanie,
  //       };
  //     this.getCompanies(1, search)
  //   }
  // }

  //
  // selectCompanie(companie: Companie) {
  //   this.fetchedProduct.vendors = [companie]
  // }
  //
  // removeCompanie(i: number) {
  //   this.fetchedProduct.vendors.splice(i, 1);
  // }
  //
  // getCompanies(page: number, search: any) {
  //   this.companieService.getCompanies(page, search)
  //     .subscribe(
  //       res => {
  //         this.fetchedCompanies = res.data
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  // }


  openDialogDelete() {
    const this2 = this
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent)
    dialogRefDelete.afterClosed().subscribe(result => {
      if (result) {
        this.onDelete(this.fetchedProduct._id).then(function() {
          this2.router.navigate(['product']);
        })
      }
    })
  }

  // openDialogDelete(){
  //   const this2 = this
  //   let dialogRefDelete = this.dialog.open(DeleteDialog)
  //   dialogRefDelete.afterClosed().subscribe(result => {
  //     if(result) {
  //       this.onDelete(this.fetchedProduct._id).then(function(){
  //         this2.router.navigate(['user']);
  //       })
  //
  //     }
  //   })
  // }


  // goBack() {
  //   this.location.back();
  // }

  // openDialog(positionImage: string) {
  //   // let dialogRef = this.dialog.open(EditOptionsComponentDialog);
  //   // dialogRef.afterClosed().subscribe(result => {
  //   //   if(result) {
  //   //     this.fetchedProduct.forms.push( result)
  //   //   }
  //   // })
  // }

  // getPicture(result){
  //
  // }
  save() {

    // this.fetchedProduct.categorie.categ1 = [{name: this.categ1}]
    // this.fetchedProduct.categorie.categ2 = [{name: this.categ2}]
    // this.fetchedProduct.categorie.categ3 = [{name: this.categ3}]
    const this2 = this
    return new Promise(function(resolve, reject) {
      let categName0 = ''
      let categName1 = ''
      let categName2 = ''

      if(this2.selectedIndex0>=0) {categName0 = this2.itemSteps[this2.selectedIndex0].categ}
      if(this2.selectedIndex1>=0) {categName1 = this2.itemSteps[this2.selectedIndex0].subCateg[this2.selectedIndex1].categ}
      if(this2.selectedIndex2>=0) {categName2 = this2.itemSteps[this2.selectedIndex0].subCateg[this2.selectedIndex1].subCateg[this2.selectedIndex2].categ}


      this2.fetchedProduct.categorie.categ0 = [{name: categName0}]
      this2.fetchedProduct.categorie.categ1 = [{name: categName1}]
      this2.fetchedProduct.categorie.categ2 = [{name: categName2}]



      if(this2.fetchedProduct._id) {
        this2.productService.updateProduct(this2.fetchedProduct)
          .subscribe(
            res => {
              resolve(res)
              this2.toastr.success('Great!', res.message)
              // this2.router.navigate(['product']);
              this2.getProduct(res.obj._id)
              // this2.saved.emit(res.obj)
            },
            error => {
              reject(error)
              console.log(error)}
          );
      } else {
        this2.productService.saveProduct(this2.fetchedProduct)
          .subscribe(
            res => {
              resolve(res)
              this2.toastr.success('Great!', res.message)
              this2.getProduct(res.obj._id)
              // this2.router.navigate(['product']);

            },
            error => {
              reject(error)
              this2.toastr.error('Error!', error.message)
              console.log(error)
            }
          );
      }
    })
  }




  getProduct(id: string) {
    this.productService.getProduct(id)
      .subscribe(
        res => {
          this.fetchedProduct = <Product>res

          let categName0 = ''
          let categName1 = ''
          let categName2 = ''

          if(this.fetchedProduct.categorie.categ0.length)
            categName0 = this.fetchedProduct.categorie.categ0[0].name
          if(this.fetchedProduct.categorie.categ1.length)
            categName1 = this.fetchedProduct.categorie.categ1[0].name
          if(this.fetchedProduct.categorie.categ2.length)
            categName2 = this.fetchedProduct.categorie.categ2[0].name

          this.itemSteps.forEach((categ0, index) => {
            if(categ0.categ === categName0)
              this.selectedIndex0 = index
          })

          if(this.selectedIndex0 >= 0)
          this.itemSteps[this.selectedIndex0].subCateg.forEach((categ1,index) => {
            if(categ1.categ === categName1)
              this.selectedIndex1 = index
          })
          if(this.selectedIndex1 >= 0)
          this.itemSteps[this.selectedIndex0].subCateg[this.selectedIndex1].subCateg.forEach((categ2,index) => {
            if(categ2.categ === categName2)
              this.selectedIndex2 = index
          })
        },
        error => {
          console.log(error);
        }
      )
  }


  onDelete(id: string) {
    let this2 = this
    return new Promise(function(resolve, reject) {
      this2.productService.deleteProduct(id)
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


}
