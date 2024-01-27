import { Component, OnInit } from '@angular/core';
import { RouteService } from '../shared/services/router.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  constructor(public routeService: RouteService) {}

  ngOnInit(): void {}

  goback(): void {
      this.routeService.navigateToBack('/dashboard');
  }

}
