import { Component, OnInit, Input } from '@angular/core';
import { AuthService} from '../../auth/auth.service';
import { ProjectService} from '../project.service';
import { Project} from '../project.model';
import { ToastsManager} from 'ng2-toastr';
import { MatDialog} from '@angular/material';
import { Router} from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewEncapsulation} from '@angular/core';
import { UserService} from '../../user/user.service';
import { Search, PaginationData } from '../../shared/shared.model';
import { GlobalEventsManager } from '../../globalEventsManager';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['../project.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class ProjectsComponent implements OnInit {

  fetchedProjects: Project[] = [];
  @Input() search: Search = new Search()

  paginationData: PaginationData = new PaginationData()

  constructor(
    private projectService: ProjectService,
    private toastr: ToastsManager,
    private globalEventsManager: GlobalEventsManager,
  ) {
  }

  ngOnInit() {


    // setTimeout(function(){
      // this2.search.userId = this2.userId
      this.search.orderBy = '-createdAt';
      this.getProjects(1, this.search)
    // }, 200);
  }
  // goBack() {
  //   this.location.back();
  // }

  searchProjects() {
    this.getProjects(1, this.search)
  }
  orderBy(orderBy: string) {
    this.getProjects(this.paginationData.currentPage, this.search);
  }
  // orderBy(orderBy: string) {
  //   this.search.orderBy = orderBy;
  //   this.getProjects(this.paginationData.currentPage, this.search);
  // }

  saved(result) {
    console.log(result)
  }
  onDelete(id: string) {
    this.projectService.deleteProject(id)
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
    this.getProjects(page, this.search);
  }


  loadMore(){
    this.paginationData.currentPage = this.paginationData.currentPage+1
    this.getProjects(this.paginationData.currentPage, this.search)
  }


  getProjects(page : number, search: any) {
    //this.fetchedProjects =[]
    this.globalEventsManager.isLoadding(true);
    this.projectService.getProjects(page, search)
      .subscribe(
        res => {
          this.paginationData = res.paginationData;
          this.fetchedProjects = res.data

          this.globalEventsManager.isLoadding(false);
        },
        error => {
          console.log(error);
        }
      );
  }



  // isAdmin() {
  //   return this.authService.isAdmin();
  // }
}
