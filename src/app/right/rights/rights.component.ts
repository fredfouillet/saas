import { Component, OnInit} from '@angular/core';
import { AuthService} from '../../auth/auth.service';
import { RightService} from '../../right/right.service';
import { Right} from '../right.model';
import { ToastsManager} from 'ng2-toastr';
import { MatDialog} from '@angular/material';
import { Router} from '@angular/router';
import { Location} from '@angular/common';
import { GlobalEventsManager } from '../../globalEventsManager';



@Component({
  selector: 'app-right',
  templateUrl: './rights.component.html',
  styleUrls: ['../../admin/admin.component.css'],
})
export class RightsComponent implements OnInit {
  fetchedRights: Right[] = [];

  paginationData = {
    currentPage: 1,
    itemsPerPage: 0,
    totalItems: 0
  };

  search = {
    orderBy : '',
    search: '',
    rightType: '',
  };

  constructor(
    private rightService: RightService,
    private authService: AuthService,
  //  private modalService: NgbModal,
    private toastr: ToastsManager,
    public dialog: MatDialog,
    private router: Router,
    private location: Location,
    private globalEventsManager: GlobalEventsManager,
  ) {}

  ngOnInit() {
    this.search.orderBy = 'name'
    this.getRights(this.paginationData.currentPage, this.search)
  }

  saved(result) {

  }

  goBack() {
    this.location.back();
  }

  // searchInput() {
  //   this.getRights(this.paginationData.currentPage, this.search)
  // }
  //
  // orderBy(orderBy: string) {
  //   this.search.orderBy = orderBy
  //   this.getRights(this.paginationData.currentPage, this.search)
  // }

  onDelete(id: string) {
    this.rightService.deleteRight(id)
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


  searchRights() {
    this.getRights(1, this.search)
  }


  getPage(page: number) {

    this.globalEventsManager.isLoadding(true);
    this.getRights(page, this.search);
  }


  getRights(page: number, search: any) {
    this.rightService.getRights(page, search)
      .subscribe(
        res => {
          this.paginationData = res.paginationData;
          this.fetchedRights =  res.data
          this.globalEventsManager.isLoadding(false);
        },
        error => {
          console.log(error);
        }
      );
  }


  isAdmin() {
    return this.authService.isAdmin();
  }


}
