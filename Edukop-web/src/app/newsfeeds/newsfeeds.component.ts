import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { IComment } from '../model/IComment.model';
import { INews } from '../model/INews.model';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-newsfeeds',
  templateUrl: './newsfeeds.component.html',
  styleUrls: ['./newsfeeds.component.scss']
})
export class NewsfeedsComponent implements OnInit {
  isMobile: boolean = false;
  showCommnets: boolean = true;
  isLiked: boolean = false;
  noData: boolean = false;
  noCommnetData: boolean = false;
  newsFeed: INews[] = [];
  totalLikes!: number;
  currentIndex: number = -1;
  pageNumber: number = 0;
  commentPageNo: number = 0;
  pageLimit: number = 10;
  imageApi!: string;
  commentsList: IComment[] = [];
  commentTxt!: string;

  constructor(
    public router: Router,
    public auth: AuthService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.imageApi = environment.imageApi;
    this.checkWindowSize();

    window.addEventListener("resize", (event) => {
      // location.reload();
      this.checkWindowSize();
    });

    this.getNews(true);
  }

  checkWindowSize() {
    if(window.innerWidth < 768) {
      this.isMobile = true;
      this.showCommnets = false;
    } else {
      this.isMobile = false;
      this.showCommnets = true;
    }
  }

  getNews(isFirstload: boolean) {
    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumber + 1,
      pageSize: this.pageLimit
    };

    this.spinner.show();

    this.sharedService.getNews(paginate).subscribe(response => {
      if (response.DATA) {
        if (response.DATA.docs.length < 1) {
          this.noData = true;
          
        } else {
          for (let i = 0; i < response.DATA?.docs.length; i++) {
            this.newsFeed.push(response.DATA.docs[i]);

            for (let i = 0; i < this.newsFeed.length; i++) {
              let newsId = this.newsFeed[i].uuid;
              (this.newsFeed[i] as any).readMore = false;
              this.getLikebyId(newsId, i);
              this.getCommentCount(newsId, i);
              this.spinner.hide();
            }
          }

          if(this.newsFeed.length != 0) {
            this.currentIndex = 0;
            this.postComments(this.newsFeed[0].uuid, 0, true);
          }
        }
      }
    })
  }


  getCommentCount(newsuuid: string, i: number): void {
    this.spinner.show();
    this.sharedService.getCommentCount(newsuuid).subscribe(res => {
      if (res) {
        this.newsFeed[i].numberOfComments = res.DATA.numberOfComment;
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    })
  }

  getLikebyId(newsuuid: string, i: number): void {
    this.sharedService.getLikeById(newsuuid).subscribe(res => {
      if (res) {
        this.newsFeed[i].liked = res.DATA.isLiked;
        this.newsFeed[i].numberOfLikes = res.DATA.numberOfLikes;
      }
    }, (err) => {
    });
  }

  likeDislike(uuid: string, index: number) {
    this.sharedService.postLike(uuid).subscribe(res => {
      this.newsFeed[index].liked = !this.newsFeed[index].liked;
      this.getLikebyId(uuid, index);
    })
  }

  postComments(uuid: string, index: number, firstLoad: boolean) {
    this.currentIndex = index;
    this.showCommnets = true;

    if(firstLoad == true) {
      this.commentsList = [];
      this.commentPageNo = 0;
    }

    const paginate: interfaces.IPaginate = {
      pageIndex: this.commentPageNo + 1,
      pageSize: this.pageLimit,
    };

    this.spinner.show();

    this.sharedService.getComments(paginate, uuid).subscribe(res => {
      this.spinner.hide();
      if(res.DATA) {
        if(res.DATA.docs.length < 1) {
          this.noCommnetData = true;
          return;
        } else if(res.DATA.docs.length == 10) {
          this.noCommnetData = false;
        } else {
          this.noCommnetData = true;
        }

        for(let i=0; i < res.DATA.docs.length; i++) {
          let index = this.commentsList.findIndex(cmnt => cmnt.uuid === res.DATA.docs[i].uuid);
          if(index === -1) {
            this.commentsList.push(res.DATA.docs[i]);
          }
        }
        
        if(res.DATA.docs.length == 10) {
          this.commentPageNo++;
        }
        
      }
      this.spinner.hide();
    }, (error) => {
      this.spinner.show();
    });
  }
  
  addComment() {
    const param: interfaces.IComment = {
      news_uuid: this.newsFeed[this.currentIndex].uuid,
      comment_text: this.commentTxt,
    };
    
    this.spinner.show();

    this.sharedService.addComment(param).subscribe(res => {
      this.commentTxt = '';
      this.postComments(this.newsFeed[this.currentIndex].uuid, 0, true);
      this.spinner.hide();
    });
  }

}
