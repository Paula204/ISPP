import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account, AccountService } from 'app/core';
import { HasAnyAuthorityDirective } from 'app/shared';
import { JhiAlertService } from 'ng-jhipster';

@Component({
    selector: 'jhi-upgrade-user',
    templateUrl: './upgrade-user.component.html',
    styles: []
})
export class UpgradeUserComponent implements OnInit {
    isSponsor: any;
    currentAccount: Account;
    eso: string;
    constructor(protected jhiAlertService: JhiAlertService, protected accountService: AccountService, private router: Router) {}

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.accountService.hasAuthority('ROLE_SPONSOR').then(role => {
            this.isSponsor = role;
        });
    }

    payPremium() {
        this.router.navigate(['paypal-payments/premium']);
    }

    paySponsor() {
        this.router.navigate(['paypal-payments/sponsor']);
    }
}
