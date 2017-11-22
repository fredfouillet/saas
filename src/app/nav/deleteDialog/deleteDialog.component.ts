import { Component} from '@angular/core';

import {  MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-delete-dialog',
  templateUrl: './deleteDialog.component.html',
})
export class DeleteDialogComponent {
  constructor(public dialogRefDelete: MatDialogRef<DeleteDialogComponent>) {}

  // deletePress(){
  //   console.log("delete")
  // }
}
