import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import { UserComponent } from '../user.component';



@Component({
  selector: 'edit-options-dialog',
  templateUrl: './userDialog.component.html',
})

export class UserDialogComponent{
  // @ViewChild(NewUserComponent)
  // private newUserComponent: NewUserComponent;
  search: any;

  constructor(
    public dialogRef: MatDialogRef<UserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data.search)
    this.search = data.search
  }
  saved(data) {
    this.dialogRef.close(data)
  }

}
