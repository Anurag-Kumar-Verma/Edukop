import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../services/shared.service';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  faqList: interfaces.IQNA[] = [];
  productUuid: string = '';

  constructor(
    private activeRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.productUuid = this.activeRoute.snapshot.paramMap.get('id') as string;

    this.getFAQs(this.productUuid);
  }

  getFAQs(uuid: string) {
    this.spinner.show();
    this.sharedService.getFaq(uuid).subscribe(res => {
      if(res.faqs.length > 0){
        for(let i in res.faqs){
          this.faqList.push(res.faqs[i]);
        }
      }
      this.spinner.show();
    }, error => {
      this.spinner.show();
    })
  }

  goBack(){
    history.back();
  }

}
