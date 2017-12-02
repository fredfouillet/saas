import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { AuthService} from '../../auth/auth.service';
import { ProductService} from '../product.service';
import { Product} from '../product.model';
import { ToastsManager} from 'ng2-toastr';
// import { MatDialog} from '@angular/material';
import { Router} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewEncapsulation} from '@angular/core';
// import { UserService} from '../../user/user.service';
import { GlobalEventsManager } from '../../globalEventsManager';
import { Search, PaginationData } from '../../shared/shared.model';
// import { TranslateService } from '../../translate/translate.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['../product.component.css'],
  // encapsulation: ViewEncapsulation.None

})
export class ProductsComponent implements OnInit {
  @Input() customButton: string = '';
  @Input() showNewItem: boolean = true;
  @Input() showTitle: boolean = true;
  @Output() customButtonActionEmit: EventEmitter<any> = new EventEmitter();
  // token: string = localStorage.getItem('id_token');
  fetchedProducts: Product[] = [];
  search: Search = new Search()
  // loading: boolean= false;

  paginationData: PaginationData = new PaginationData()

  // trackinPage : any = {
  //   lastVisitPagePressCount:[],
  //   lastVisitPageProductCount:[]
  // }

  constructor(
    private sanitizer: DomSanitizer,
    private productService: ProductService,
    private toastr: ToastsManager,
    // public dialog: MatDialog,
    private router: Router,
    // private location: Location,
    private authService: AuthService,
    // private userService: UserService,
    private globalEventsManager: GlobalEventsManager,
    // private translateService: TranslateService,
  ) {
  }



  customButtonAction(product: Product) {
    this.customButtonActionEmit.emit(product);
  }

  actionRow(productId: string) {
    if(!this.customButton)
      this.router.navigate(['/product/' + productId]);
  }
  searchProducts() {
    this.getProducts(1, this.search)
  }


  orderBy(orderBy: string) {
    // this.search.orderBy = orderBy;
    this.getProducts(this.paginationData.currentPage, this.search);
  }

  onDelete(id: string) {
    this.productService.deleteProduct(id)
      .subscribe(
        res => {
          this.toastr.success('Great!', res.message);
          console.log(res);
        },
        error => {
          console.log(error);
        }
      );
  }

  getPage(page: number) {
    this.getProducts(page, this.search);
  }
  saved(result) {
    if(result)
      this.getProducts(1, this.search)
  }

  // loadMore(){
  //   this.paginationData.currentPage = this.paginationData.currentPage+1
  //   this.getProducts(this.paginationData.currentPage, this.search)
  // }

  getProducts(page: number, search: any) {
    this.globalEventsManager.isLoadding(true);
    this.productService.getProducts(page, search)
      .subscribe(
        res => {
          this.paginationData = res.paginationData;
          this.fetchedProducts = res.data
          this.globalEventsManager.isLoadding(false);
        },
        error => {
          console.log(error);
        }
      );
  }


  ngOnInit() {
    // this.translateService.use('fr');
    // console.log(this.translateService.instant('Add a product'))
    this.getProducts(1, this.search)
  }

  isAdmin() {
    return this.authService.isAdmin();
  }
}
