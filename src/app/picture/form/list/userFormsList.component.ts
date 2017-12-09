import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormService} from '../form.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
// import { SeePictureDialogComponent } from '../seePictureDialog/seePictureDialog.component';
import { MatDialog} from '@angular/material';
import { Form } from '../form.model';
import { GlobalEventsManager } from '../../../globalEventsManager';


@Component({
  selector: 'app-user-form-list',
  templateUrl: './userFormsList.component.html',
  styleUrls: ['../form.component.css']
})
export class UserFormsListComponent implements OnInit {
  @Input() itemsPerPage: number;
  @Input() isDialog: boolean;
  @Input() showPagination: boolean = true;


  @Output() onPassForm = new EventEmitter<any>();
  @Output() removeForm = new EventEmitter<any>();
  @Output() getUserForms = new EventEmitter<any>();
  @Input() fetchedForms: Form[] = [];
  @Input() deletePicture: boolean = true;

  @Input() paginationData = {
    currentPage: 1,
    itemsPerPage: 0,
    totalItems: 0
  };

  // search = {
  //   id: '',
  //   itemsPerPage:5,
  //   seeAll:false
  // }


  constructor(
    public dialog: MatDialog,
    private formService: FormService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private globalEventsManager: GlobalEventsManager,
  ) {}

  ngOnInit() {
      // this.refresh()
  }
  refresh(){
    // let this2 = this
    // setTimeout(function(){
    //     this2.getUserForms(this2.paginationData.currentPage)
    // }, 50);

  }

  getPage(page: number) {
    this.getUserForms.emit(page);
  }

  // getUserForms(page: number){
  //   this.globalEventsManager.isLoadding(true);
  //   this.search['id'] = this.authService.currentUser.userId,
  //   this.search['itemsPerPage'] = this.itemsPerPage,
  //
  //
  //   this.formService.getUserForms(page, this.search)
  //     .subscribe(
  //       res => {
  //         this.globalEventsManager.isLoadding(false);
  //         this.paginationData = res.paginationData;
  //         this.fetchedForms = res.data
  //       },
  //       error => console.log(error))
  // }
  isFormPdf(form: Form){
    if(form.type === 'pdf')
      return true
    return false
  }
  onSelectRow(form: Form){

    // if(this.isDialog) {
      this.onPassForm.emit(form);
    // } else {
    //   if(this.isFormPdf(form)) {
    //     let url = './uploads/forms/' + form.owner + '/' + form.imagePath
    //     window.open(url);
    //   } else {
    //
    //   }

    // }

  }
  isAdmin() {
    return this.authService.isAdmin();
  }

  onDelete(formId: string) {
    this.removeForm.emit(formId);

    // this.formService.deleteForm(formId)
    //   .subscribe(
    //     res => {
    //       this.getUserForms(this.paginationData.currentPage)
    //     },
    //     error => console.log(error))
  }
  onUploadFinisedParentToChild(){
    this.ngOnInit()
  }
}
