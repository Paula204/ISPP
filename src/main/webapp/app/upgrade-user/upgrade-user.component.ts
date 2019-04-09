import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-upgrade-user',
    templateUrl: './upgrade-user.component.html',
    styles: []
})
export class UpgradeUserComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit() {}

    payPremium() {
        this.router.navigate(['paypal-payments/premium']);
    }

    paySponsor() {
        this.router.navigate(['paypal-payments/sponsor']);
    }
}
