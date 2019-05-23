import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParticipation } from 'app/shared/model/participation.model';
import { filter, map } from 'rxjs/operators';
import { ISponsorship, Sponsorship } from 'app/shared/model/sponsorship.model';
import { SponsorshipService } from 'app/entities/sponsorship';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Account, AccountService, User } from 'app/core';
@Component({
    selector: 'jhi-participation-detail',
    templateUrl: './participation-detail.component.html'
})
export class ParticipationDetailComponent implements OnInit {
    participation: IParticipation;
    sponsorship: ISponsorship;
    currentAccount: Account;
    constructor(
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute,
        protected sponsorshipService: SponsorshipService
    ) {}

    ngOnInit() {
        this.sponsorship = {};
        this.activatedRoute.data.subscribe(({ participation }) => {
            this.participation = participation;
        });
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.sponsorshipService
            .findRandom()
            .pipe(
                filter((response: HttpResponse<Sponsorship>) => response.ok),
                map((sponsorship: HttpResponse<Sponsorship>) => sponsorship.body)
            )
            .subscribe(value => (this.sponsorship = value));
    }

    previousState() {
        window.history.back();
    }
}
