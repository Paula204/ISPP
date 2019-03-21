import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IFree } from 'app/shared/model/free.model';
import { AccountService } from 'app/core';
import { FreeService } from './free.service';

@Component({
    selector: 'jhi-free',
    templateUrl: './free.component.html'
})
export class FreeComponent implements OnInit, OnDestroy {
    frees: IFree[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected freeService: FreeService,
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
            this.freeService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IFree[]>) => res.ok),
                    map((res: HttpResponse<IFree[]>) => res.body)
                )
                .subscribe((res: IFree[]) => (this.frees = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.freeService
            .query()
            .pipe(
                filter((res: HttpResponse<IFree[]>) => res.ok),
                map((res: HttpResponse<IFree[]>) => res.body)
            )
            .subscribe(
                (res: IFree[]) => {
                    this.frees = res;
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
        this.registerChangeInFrees();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IFree) {
        return item.id;
    }

    registerChangeInFrees() {
        this.eventSubscriber = this.eventManager.subscribe('freeListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
