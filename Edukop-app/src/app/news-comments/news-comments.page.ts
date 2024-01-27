import { Component, OnInit, ViewChild } from '@angular/core';
import { RouteService } from '../shared/services/router.service';
import { SharedService } from '../shared/services/shared.service';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';
import { LoaderService } from '../shared/loader/loader.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { IComment } from '../models/IComment.model';


@Component({
  selector: 'app-news-comments',
  templateUrl: './news-comments.page.html',
  styleUrls: ['./news-comments.page.scss'],
})
export class NewsCommentsPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;
  pageNumber: number = 0;
  pageLimit: number = 10;
  newsUUID: any;
  noData: boolean = false;
  isDataLoaded: boolean = false;
  allComments: IComment[] = [];
  imageUrl: string;
  noRelavantData: boolean = false;
  comment: string;
  isLoading : boolean = true;

  constructor(
    public routeService: RouteService,
    private sharedService: SharedService,
    private loadingService: LoaderService,
  ) { }

  ngOnInit() {
    this.imageUrl = environment.imageApi;
    this.newsUUID = history.state.data.uuid;
    // this.getComments(this.newsUUID);
    this.search(this.newsUUID, true, undefined);
  }


  back(): void {
    this.routeService.navigateToBack('ionic');
  }
  
  addComment() {
    const param: interfaces.IComment = {
      news_uuid: this.newsUUID,
      comment_text: this.comment,
    };
    // this.loadingService.display(true);
    this.sharedService.addComment(param).subscribe(res => {
      this.comment = '';
      this.search(this.newsUUID, false, undefined);
      // this.getcomment(this.newsUUID);
    })
  }

  loadData(event) {
    this.search(this.newsUUID, true, event);
  }

  getcomment(commentuuid) {
    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumber + 1,
      pageSize: this.pageLimit,
    };
    this.sharedService.getComments(paginate, commentuuid).subscribe(
      response => {
      });

  }


  search(
    newsUUID: string,
    isFirstLoad: boolean,
    event: any
  ): void {
    // searchData.sort = this.sort;
    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumber + 1,
      pageSize: this.pageLimit,
    };
    // this.loadingService.display(true);
   
    this.sharedService.getComments(paginate, newsUUID).subscribe(
      response => {
        if (response.DATA) {
          if (response.DATA.docs.length < 1) {
            this.noData = true;
            this.isDataLoaded = false;
            this.pageNumber = this.pageNumber - 1;
          }
          if (response.DATA.docs.length > 0) {
            this.noData = false;
          }
          for (let i = 0; i < response.DATA?.docs.length; i++) {
            const index = this.allComments.findIndex(cmt => (cmt.uuid === response.DATA.docs[i].uuid));
            if (index === -1) {
              this.allComments.push(response.DATA.docs[i]);
            }

            // this.loadingService.display(false);
          }
        }
        if (isFirstLoad) {
          this.isLoading = false;
          this.infiniteScroll.complete();
        }
        if (!this.noData) {
          this.pageNumber++;
        }
        this.isDataLoaded = true;
        this.loadingService.display(false);
      },
      error => {
        this.loadingService.display(false);
      }
    );
  }
}
