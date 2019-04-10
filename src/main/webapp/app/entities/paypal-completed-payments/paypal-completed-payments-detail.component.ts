import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';

@Component({
    selector: 'jhi-paypal-completed-payments-detail',
    templateUrl: './paypal-completed-payments-detail.component.html'
})
export class PaypalCompletedPaymentsDetailComponent implements OnInit {
    paypalCompletedPayments: IPaypalCompletedPayments;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ paypalCompletedPayments }) => {
            this.paypalCompletedPayments = paypalCompletedPayments;
        });
    }

    previousState() {
        window.history.back();
    }
}
