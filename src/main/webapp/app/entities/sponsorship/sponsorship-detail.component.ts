import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISponsorship } from 'app/shared/model/sponsorship.model';

@Component({
    selector: 'jhi-sponsorship-detail',
    templateUrl: './sponsorship-detail.component.html'
})
export class SponsorshipDetailComponent implements OnInit {
    sponsorship: ISponsorship;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ sponsorship }) => {
            this.sponsorship = sponsorship;
        });
    }

    previousState() {
        window.history.back();
    }
}
