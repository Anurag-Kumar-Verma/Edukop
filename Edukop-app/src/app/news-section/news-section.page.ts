import { Component, OnInit, ViewChild } from '@angular/core';
import { RouteService } from '../shared/services/router.service';
import { SharedService } from '../shared/services/shared.service';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { environment } from 'src/environments/environment';
import { IonSlides } from '@ionic/angular';
import { ILike } from '@spundan-clients/bookz-interfaces';
import { AuthService } from '../auth/services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoaderService } from '../shared/loader/loader.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { INews } from '../models/INews.model';

@Component({
  selector: 'app-news-section',
  templateUrl: './news-section.page.html',
  styleUrls: ['./news-section.page.scss'],
})
export class NewsSectionPage implements OnInit {
  @ViewChild('slides') slides: IonSlides;
  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;
  // slides: IonSlides;
  // readMore: boolean = false;
  imageApi: string;
  noData: boolean = false;
  isDataLoaded: boolean = false;
  pageNumber: number = 0;
  pageLimit: number = 10;
  newsFeed: INews[] = [];
  currentIndex: number;
  imageIndex: any;

  newsId: string;
  likes: boolean = false;
  liked: boolean;
  likedData: interfaces.ISchool;
  LikeData: any;
  totalLikes: any;
  isLiked: boolean = false;
  constructor(
    public routeService: RouteService,
    private sharedService: SharedService,
    public auth: AuthService,
    public loader: LoadingController,
    public router: Router,
    private loadingService: LoaderService,

  ) { }

  ngOnInit() {
    this.imageApi = environment.imageApi;
    this.getLikes();
  }

  ionViewWillEnter(): void {
    // this.getNews();
    this.pageNumber = 0;
    this.search(true, undefined);
  }


  readMorebtn(id, i): void {
    if (!(this.newsFeed[i] as any).readMore) {
      (this.newsFeed[i] as any).readMore = true;
    } else {
      (this.newsFeed[i] as any).readMore = false;
    }
  }

  back(): void {
    this.routeService.navigateToBack('ionic');
  }


  // getNews(): void {
  //   const paginate: interfaces.IPaginate = {
  //     pageIndex: this.pageNumber + 1,
  //     pageSize: this.pageLimit,
  //   };
  //   this.loadingService.display(true);
  //   this.sharedService.getNews(paginate).subscribe(res => {
  //     this.newsFeed = res.DATA.docs;
  //     for (let i = 0; i < this.newsFeed.length; i++) {
  //       this.newsId = this.newsFeed[i].uuid;
  //       this.getLikebyId(this.newsId, i);
  //       this.getCommentCount(this.newsId,i);
  //       this.loadingService.display(false);
  //     }
  //     this.imageIndex = this.newsFeed.news_images;
  //   })

  // }

  // activeIndex(e, i): void {

  //   this.slides.getActiveIndex().then((res: number) => {

  //     (this.newsFeed[i] as any).index = res;

  //     // this.currentIndex = res;

  //   })
  // }

  openComments(news) {
    this.router.navigateByUrl('/tab/news-comments/' + Math.random(), {
      state: {
        data: news,
      }
    }).catch();
  }

  getLikes(): void {
    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumber + 1,
      pageSize: this.pageLimit,
    };
    this.sharedService.getLikes(paginate).subscribe(res => {
    })
  }

  likePost(news_uuid, i): void {
    (this.newsFeed[i] as any).liked == true;
    this.sharedService.postLike(news_uuid).subscribe(res => {
      // (this.newsFeed[i] as any).liked;
      this.getLikebyId(news_uuid, i)
    });
  }

  getCommentCount(newsuuid, i): void {
    this.loadingService.display(true);
    this.sharedService.getCommentCount(newsuuid).subscribe(res => {
      if (res) {
        (this.newsFeed[i] as any).numberOfComments = res.DATA.numberOfComment;
        this.loadingService.display(false);
      }
    })
  }

  getLikebyId(newsuuid, i): void {
    this.sharedService.getLikeById(newsuuid).subscribe(res => {
      if (res) {
        (this.newsFeed[i] as any).liked = res.DATA.isLiked;
        (this.newsFeed[i] as any).numberOfLikes = res.DATA.numberOfLikes;
      }
      else {
        console.log("err")
      }
    }, (err) => {
      console.log(err)
    })
  }




  loadData(event) {
    this.search(true, event);
  }

  search(isFirstLoad: boolean, event: any): void {
    // searchData.sort = this.sort;
    const paginate: interfaces.IPaginate = {
      pageIndex: this.pageNumber + 1,
      pageSize: this.pageLimit,
    };
    this.loadingService.display(true);

    this.sharedService.getNews(paginate).subscribe(
      response => {
        if (response.DATA) {
          if (response.DATA.docs.length < 1) {
            this.noData = true;
            this.isDataLoaded = false;
          }
          if (response.DATA.docs.length > 0) {
            for (let i = 0; i < response.DATA?.docs.length; i++) {
              this.newsFeed.push(response.DATA.docs[i]);
              for (let i = 0; i < this.newsFeed.length; i++) {
                this.newsId = this.newsFeed[i].uuid;
                (this.newsFeed[i] as any).readMore = false;
                this.getLikebyId(this.newsId, i);
                this.getCommentCount(this.newsId, i);
                this.loadingService.display(false);
              }
            }
          }
        }
        if (isFirstLoad) {
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
