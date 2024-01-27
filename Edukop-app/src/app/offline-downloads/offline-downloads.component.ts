import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FileTransfer,
  FileTransferObject,
  FileUploadOptions,
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { LoaderService } from '../shared/loader/loader.service';

interface DownloadedFileType {
  name: string;
  path: string;
  fileName: string;
  imageUrl: string;
}

@Component({
  selector: 'app-offline-downloads',
  templateUrl: './offline-downloads.component.html',
  styleUrls: ['./offline-downloads.component.scss'],
})
export class OfflineDownloadsComponent implements OnInit {
  userId = JSON.parse(localStorage.getItem('userId'));
  downloadedData: DownloadedFileType[] = [];
  storagePath: string;
  isDataLoaded: boolean = false;
  constructor(
    private transfer: FileTransfer,
    private file: File,
    public router: Router,
    public loadingService: LoaderService,
    public navCtrl: NavController
  ) {
    this.loadingService.display(true);
  }

  ngOnInit(): void {
    this.getDirectives(() => {
      this.isDataLoaded = true;
      this.loadingService.display(false);
    })
  }

  getDirectives(cb): void {
    this.userId = JSON.parse(localStorage.getItem('userId'));
    this.storagePath = this.file.externalApplicationStorageDirectory + 'files/';
    const userPath = this.storagePath + 'bookzeycache/Users';
    setTimeout(() => {
      this.file.listDir(userPath, this.userId)?.then((a) => {
        a.map((ca, i) => {
          this.file.listDir(userPath + '/' + this.userId, ca.name).then(async ba => {
            ba.map((c, j) => {
              if (c.name.split('.')[1] === 'name') {
                this.file.readAsText(userPath + '/' + this.userId + '/' + c.name.split('.')[0], c.name).then(b => {
                  const fd: DownloadedFileType = {
                    name: b,
                    path: ca.fullPath,
                    fileName: c.name.split('.')[0],
                    imageUrl: ''
                  };
                  this.downloadedData.push(fd);
                });
              }
              if (c.name.split('.')[1] === 'thumb') {
                this.file.readAsText(userPath + '/' + this.userId + '/' + c.name.split('.')[0], c.name).then(b => {
                  this.downloadedData[j].imageUrl = environment.thumbApi + b;
                });
              }
            });
            cb();
          });
        });
      }).catch(() => {
        cb();
      }
      );
    }, 400);
  }

  goback(): void {
    this.navCtrl.navigateRoot('/tab/dashboard');
  }

  openPDF(data: DownloadedFileType): void {
    this.loadingService.display(true);
    this.file
      .readAsArrayBuffer(
        this.file.externalApplicationStorageDirectory + 'files' + data.path,
        data.fileName
      )
      .then(res => {
        this.loadingService.display(false);
        this.router.navigateByUrl(
          '/tab/pdf-previewer/' + Math.random(),
          {
            state: {
              data: { name: data.name },
              path: res,
            },
          }
        );
      }).catch(er => {
        //this.loadingService.display(false);
      });
  }

}
