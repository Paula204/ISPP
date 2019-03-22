import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPremium } from 'app/shared/model/premium.model';
import { AccountService } from 'app/core';
import { PremiumService } from './premium.service';

@Component({
    selector: 'jhi-premium',
    templateUrl: './premium.component.html'
})
export class PremiumComponent implements OnInit, OnDestroy {
    premiums: IPremium[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected premiumService: PremiumService,
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
            this.premiumService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IPremium[]>) => res.ok),
                    map((res: HttpResponse<IPremium[]>) => res.body)
                )
                .subscribe((res: IPremium[]) => (this.premiums = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.premiumService
            .query()
            .pipe(
                filter((res: HttpResponse<IPremium[]>) => res.ok),
                map((res: HttpResponse<IPremium[]>) => res.body)
            )
            .subscribe(
                (res: IPremium[]) => {
                    this.premiums = res;
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
        this.registerChangeInPremiums();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPremium) {
        return item.id;
    }

    registerChangeInPremiums() {
        this.eventSubscriber = this.eventManager.subscribe('premiumListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
