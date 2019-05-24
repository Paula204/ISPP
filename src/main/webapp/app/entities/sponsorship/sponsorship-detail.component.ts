import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account, AccountService } from 'app/core';

import { ISponsorship } from 'app/shared/model/sponsorship.model';

@Component({
    selector: 'jhi-sponsorship-detail',
    templateUrl: './sponsorship-detail.component.html'
})
export class SponsorshipDetailComponent implements OnInit {
    sponsorship: ISponsorship;
    currentAccount: Account;

    constructor(protected accountService: AccountService, protected activatedRoute: ActivatedRoute) {
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ sponsorship }) => {
            this.sponsorship = sponsorship;
        });
    }

    previousState() {
        window.history.back();
    }
}
