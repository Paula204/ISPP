import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPremium } from 'app/shared/model/premium.model';

@Component({
    selector: 'jhi-premium-detail',
    templateUrl: './premium-detail.component.html'
})
export class PremiumDetailComponent implements OnInit {
    premium: IPremium;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ premium }) => {
            this.premium = premium;
        });
    }

    previousState() {
        window.history.back();
    }
}
