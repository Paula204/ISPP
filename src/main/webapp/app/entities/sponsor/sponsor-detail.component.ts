import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISponsor } from 'app/shared/model/sponsor.model';

@Component({
    selector: 'jhi-sponsor-detail',
    templateUrl: './sponsor-detail.component.html'
})
export class SponsorDetailComponent implements OnInit {
    sponsor: ISponsor;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ sponsor }) => {
            this.sponsor = sponsor;
        });
    }

    previousState() {
        window.history.back();
    }
}
