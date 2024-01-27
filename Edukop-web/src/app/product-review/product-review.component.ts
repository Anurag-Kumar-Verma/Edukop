import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductReviewFormComponent } from '../forms/product-review-form/product-review-form.component';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent implements OnInit {
  rate: number = 3;

  constructor(
    private dialog: MatDialog,

  ) { }

  ngOnInit(): void {
  }

  rateProduct(): void {
    const dialogRef = this.dialog.open(ProductReviewFormComponent, {
      // data: {
      //   action: action
      // },
      width: '500px',
      panelClass: 'guest_alert'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
