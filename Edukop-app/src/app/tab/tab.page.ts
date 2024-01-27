import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { internetConnectivityState } from '../shared/state/internetConnectivity.state';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.page.html',
    styleUrls: ['./tab.page.scss'],
})
export class TabPage implements OnInit {
    isInternetDisconnected: boolean = true;
    constructor(
        private internetState: internetConnectivityState,
    ) {}

    ngOnInit(): void {
        this.internetState.getState().subscribe(res=>{
            this.isInternetDisconnected = this.internetState.stateValue;
        })
    }
}
