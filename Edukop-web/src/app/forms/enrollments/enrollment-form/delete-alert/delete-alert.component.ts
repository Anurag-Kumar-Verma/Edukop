import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  header: string;
  message: string
}

@Component({
  selector: 'app-delete-alert',
  templateUrl: './delete-alert.component.html',
  styleUrls: ['./delete-alert.component.scss']
})
export class DeleteAlertComponent implements OnInit {
  heading: string = "Delete";
  message: string = "Are you sure, you want to delete?"

  constructor(
    private dialogRef: MatDialogRef<DeleteAlertComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  delete(action: string) {
    this.dialogRef.close(action);
  }

}
