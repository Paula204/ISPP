import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';
import { AccountService } from 'app/core';
import { PaypalCompletedPaymentsService } from './paypal-completed-payments.service';

@Component({
    selector: 'jhi-paypal-completed-payments',
    templateUrl: './paypal-completed-payments.component.html'
})
export class PaypalCompletedPaymentsComponent implements OnInit, OnDestroy {
    paypalCompletedPayments: IPaypalCompletedPayments[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected paypalCompletedPaymentsService: PaypalCompletedPaymentsService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.paypalCompletedPaymentsService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IPaypalCompletedPayments[]>) => res.ok),
                    map((res: HttpResponse<IPaypalCompletedPayments[]>) => res.body)
                )
                .subscribe(
                    (res: IPaypalCompletedPayments[]) => (this.paypalCompletedPayments = res),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.paypalCompletedPaymentsService
            .query()
            .pipe(
                filter((res: HttpResponse<IPaypalCompletedPayments[]>) => res.ok),
                map((res: HttpResponse<IPaypalCompletedPayments[]>) => res.body)
            )
            .subscribe(
                (res: IPaypalCompletedPayments[]) => {
                    this.paypalCompletedPayments = res;
                    this.currentSearch = '';
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInPaypalCompletedPayments();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPaypalCompletedPayments) {
        return item.id;
    }

    registerChangeInPaypalCompletedPayments() {
        this.eventSubscriber = this.eventManager.subscribe('paypalCompletedPaymentsListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
