import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPromotion } from 'app/shared/model/promotion.model';
import { AccountService } from 'app/core';
import { PromotionService } from './promotion.service';

@Component({
    selector: 'jhi-promotion',
    templateUrl: './promotion.component.html'
})
export class PromotionComponent implements OnInit, OnDestroy {
    promotions: IPromotion[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected promotionService: PromotionService,
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
            this.promotionService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IPromotion[]>) => res.ok),
                    map((res: HttpResponse<IPromotion[]>) => res.body)
                )
                .subscribe((res: IPromotion[]) => (this.promotions = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.promotionService
            .query()
            .pipe(
                filter((res: HttpResponse<IPromotion[]>) => res.ok),
                map((res: HttpResponse<IPromotion[]>) => res.body)
            )
            .subscribe(
                (res: IPromotion[]) => {
                    this.promotions = res;
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
        this.registerChangeInPromotions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPromotion) {
        return item.id;
    }

    registerChangeInPromotions() {
        this.eventSubscriber = this.eventManager.subscribe('promotionListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
