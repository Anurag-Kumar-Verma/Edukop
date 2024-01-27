import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { RouteService } from '../shared/services/router.service';
import { LoaderService } from '../shared/loader/loader.service';
import { SharedService } from '../shared/services/shared.service';
import { AddressService } from './service/address.service';

@Component({
    selector: 'app-add-address',
    templateUrl: './add-address.page.html',
    styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
    isGps: any;
    stateValue: any;
    constructor(
        public router: Router,
        private navCtrl: NavController,
        private fb: FormBuilder,
        private addressService: AddressService,
        public loadingService: LoaderService,
        public sharedService: SharedService,
        private routerService: RouteService
    ) {}
    addressFormGroup: FormGroup;
    isExitCount: number = 1;
    address: interfaces.IAddress;
    cities: interfaces.ICityAndState[];
    states: any[];
    isLoading: boolean;
    ngOnInit(): void {
        this.addressForm();
        this.getStates();
    }

    private newMethod(): void {
        this.address = history.state.address;
        this.isGps = history.state.isGps;
        if (this.address) {
            this.patchAddressForm(this.address);
        } else {
            this.addressForm();
        }
    }

    addAddress(): void {
        if (this.address && !this.isGps) {
            this.addressService
                .updateAddress(this.addressFormGroup.value)
                .subscribe(res => {
                    if (res) {
                        this.addressFormGroup.reset();
                        this.navCtrl.back();
                        //     this.router.navigateByUrl('/tab/change-address/16',{replaceUrl : true}).catch();
                    }
                });
        } else {
            this.addressService
                .addAddress(this.addressFormGroup.value)
                .subscribe(res => {
                    if (res) {
                        this.addressFormGroup.reset();
                        this.navCtrl.back();
                        //   this.router.navigateByUrl('/tab/change-address/16',{replaceUrl : true}).catch();
                    }
                });
        }
    }

    patchAddressForm(address: interfaces.IAddress): void {
        // this.addressFormGroup.addControl('uuid', new FormControl() );
        this.loadingService.display(true);
        this.onStateChange(address.state);
        this.addressFormGroup = this.fb.group({
            uuid: [address.uuid],
            fullName: [address.fullName, Validators.required],
            phone: [address.phone, Validators.required],
            pincode: [address.pincode, Validators.required],
            address: [address.address, Validators.required],
            city: [address.city, Validators.required],
            state: [address.state, Validators.required],
            landmark: [address.landmark, Validators.required],
        });
        if (this.isGps == true) {
            this.addressFormGroup.get('phone').reset();
        }
        this.loadingService.display(false);
    }

    goback(): void {
        this.routerService.navigateToBack('ionic');
    }

    addressForm(): void {
        //  this.loadingService.presentLoading();

        this.addressFormGroup = this.fb.group({
            fullName: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('^[a-zA-Z ]+$'),
                ]),
            ],
            phone: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('^[6-9][0-9]{9}$'),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ]),
            ],
            pincode: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern('^[0-9]{6}$'),
                ]),
            ],
            address: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            landmark: ['', Validators.required],
        });

        // this.loadingService.loadingDismiss();
    }

    // onStateChange(isoCode: any): void {
    //     console.log(isoCode);
    //     this.stateValue = isoCode.name;
    //     this.sharedService.getCities(isoCode.isoCode).subscribe(response => {
    //         this.cities = response;
    //     });
    // }

    onStateChange(event: any): void {
        const code = this.findState(event?.detail?.value);
        if(code){
            this.sharedService.getCities(code).subscribe(response => {
                this.cities = response;
            });
        }
        if (!this.address) {
            this.addressFormGroup.get('city').reset();
        }
    }

    findState(stateName: string): string {
        const ab = this.states.find(e1 => e1.name === stateName);
        return ab ? ab.isoCode : '';
    }

    getStates(): void {
        this.sharedService.getStates().subscribe(response => {
            this.states = response;
            // console.log(this.addressFormGroup.value.state);
            // if (this.addressFormGroup.value.state) {
            //     this.stateObject = this.states.find(
            //         a => a.name === this.addressFormGroup.value.state
            //     );
            // }
            this.newMethod();
        });
    }

    // compareFn(e1: any, e2: any): void {
    //     console.log(e1, e2);
    //     // return e1.length > 0 && e2.length > 0 ? e1 === e2 : e1 === e2;
    // }

    // selectedState(e1: any): void {
    //     console.log(typeof e1);
    //     // if (typeof e1 === 'object') {
    //     //     return e1.name;
    //     // } else {
    //     //     return e1;
    //     // }
    //     // const ab = this.states ? this.states.find(a => a.isoCode === e1) : undefined;
    //     // return ab ? ab.name : '';
    // }
}
