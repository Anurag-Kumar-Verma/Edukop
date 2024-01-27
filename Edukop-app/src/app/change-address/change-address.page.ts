import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { AddressService } from '../add-address/service/address.service';
import { RouteService } from '../shared/services/router.service';
import { ToastService } from '../shared/services/toast.service';
import { SharedService } from '../shared/services/shared.service';
import {
    NativeGeocoder,
    NativeGeocoderResult,
    NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Component({
    selector: 'app-change-address',
    templateUrl: './change-address.page.html',
    styleUrls: ['./change-address.page.scss'],
})
export class ChangeAddressPage implements OnInit, OnDestroy {
    myAddressess: interfaces.IAddress[] = [];
    addressType: string;
    // sub: any;
    isLoading: boolean;
    isExitCount: number = 1;
    options = {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 3600,
    };
    // geocoder options
    nativeGeocoderOptions: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5,
    };

    latitude: number;
    longitude: number;
    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private platform: Platform,
        private addressService: AddressService,
        public toastr: ToastService,
        public routeService: RouteService,
        private geolocation: Geolocation,
        public sharedService: SharedService,
        private nativeGeocoder: NativeGeocoder,
        private diagnostic: Diagnostic
    ) {}

    ngOnInit(): void {}
    ngOnDestroy(): void {}
    ionViewWillEnter(): void {
        this.route.params.subscribe(params => {
            if (params['id'] === 'my-account') {
                localStorage.setItem('addressType', params['id']);
            }
            this.addressType = localStorage.getItem('addressType');
        });
        this.getAddress();
    }

    selectLiveLocation() {
        this.checkLocationisEnabled();
    }

    checkLocationisEnabled() {
        this.diagnostic.isLocationEnabled().then(isEnabled => {
            if (!isEnabled && this.platform.is('cordova')) {
                //handle confirmation window code here and then call switchToLocationSettings
                this.diagnostic.switchToLocationSettings();
            } else {
                this.geolocation
                    .getCurrentPosition()
                    .then(resp => {
                        this.latitude = resp.coords.latitude;
                        this.longitude = resp.coords.longitude;
                        this.getAddressLiveAddress(this.latitude, this.longitude);
                    })
                    .catch(error => {
                        console.log('Error getting location', error);
                    });

                // this._GEO.getCurrentPosition(this.geolocationOptions).then((loc : any) =>
                //  {
                //      //Your logic here
                //  }
                // )
            }
        });
    }

    getAddressLiveAddress(lat, long) {
        // this.nativeGeocoder.
        this.nativeGeocoder
            .reverseGeocode(lat, long, this.nativeGeocoderOptions)
            .then((res: NativeGeocoderResult[]) => {
                // console.log(this.pretifyAddress(res[1]));
                this.navigateToAddAddress(res[1]);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }

    navigateToAddAddress(address: NativeGeocoderResult) {
        const ads: interfaces.IAddress = {
            userId: '',
            fullName: '',
            phone: 0,
            pincode: Number(address.postalCode),
            address: address.areasOfInterest[0],
            city: address.locality,
            state: address.administrativeArea,
            landmark: address.subLocality,
        };
        this.editAddress(ads, true);
    }

    // address
    pretifyAddress(addressObj) {
        let obj = [];
        let address = '';
        for (let key in addressObj) {
            obj.push(addressObj[key]);
        }
        obj.reverse();
        for (let val in obj) {
            if (obj[val].length) address += obj[val] + ', ';
        }
        return address.slice(0, -2);
    }

    removeAddress(uuid: string): void {
        this.addressService.deleteAddress(uuid).subscribe(res => {
            if (res) {
                this.getAddress();

                this.toastr.showToast('Address Removed', 'end').catch();
            }
        });
    }

    addAddress(uuid: string): void {
        this.addressService.selectDefaultAddress(uuid).subscribe(res => {
            if (res) {
                if (this.addressType === 'my-account') {
                    this.navigateScreen();
                } else if (this.addressType === 'buy-now') {
                    this.navigateBuyNow();
                } else {
                    this.router
                        .navigateByUrl('/tab/buy-now/' + Math.random(), {
                            state: { uid: uuid },
                        })
                        .catch();
                }
            }
        });
    }

    navigateBuyNow(): void {
        localStorage.removeItem('addressType');
        this.router
            .navigateByUrl('/tab/buy-now/' + Math.random(), {
                skipLocationChange: true,
            })
            .catch();
    }

    navigateScreen(): void {
        localStorage.removeItem('addressType');
        this.router.navigateByUrl('/tab/my-account').catch();
    }

    editAddress(address: interfaces.IAddress, isGps: boolean): void {
        this.router
            .navigateByUrl('/tab/add-address/15', { state: { address, isGps } })
            .catch();
    }

    // ngOnDestroy() {
    //   localStorage.removeItem("addressType");
    //   this.sub.unsubscribe();
    // }

    goback(): void {
        this.routeService.navigateToBack('ionic');
        // if (this.addressType === 'my-account') {
        //     this.router.navigateByUrl('/tab/my-account').catch();
        //     localStorage.removeItem('addressType');
        // } else if (this.addressType === 'buy-now') {
        //     this.router.navigateByUrl('/buy-now').catch();
        //     localStorage.removeItem('addressType');
        // } else {
        //     this.navCtrl.back();
        // }
    }

    getAddress(): void {
        this.myAddressess = [];
        this.addressService.getAddress().subscribe(res => {
            for(let i in res.DATA){
                this.myAddressess.push(res.DATA[i])
            }
        });
    }

    addNewAddress(): void {
        this.router.navigateByUrl('/tab/add-address/16').catch();
    }
}
