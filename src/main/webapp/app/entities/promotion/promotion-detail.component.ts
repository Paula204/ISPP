import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPromotion } from 'app/shared/model/promotion.model';

@Component({
    selector: 'jhi-promotion-detail',
    templateUrl: './promotion-detail.component.html'
})
export class PromotionDetailComponent implements OnInit {
    promotion: IPromotion;
    currentAccount: Account;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ promotion }) => {
            this.promotion = promotion;
        });
    }

    previousState() {
        window.history.back();
    }
}
