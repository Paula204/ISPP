import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPunctuation } from 'app/shared/model/punctuation.model';
import { AccountService } from 'app/core';
import { PunctuationService } from './punctuation.service';

@Component({
    selector: 'jhi-punctuation',
    templateUrl: './punctuation.component.html'
})
export class PunctuationComponent implements OnInit, OnDestroy {
    punctuations: IPunctuation[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected punctuationService: PunctuationService,
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
            this.punctuationService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IPunctuation[]>) => res.ok),
                    map((res: HttpResponse<IPunctuation[]>) => res.body)
                )
                .subscribe((res: IPunctuation[]) => (this.punctuations = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.punctuationService
            .query()
            .pipe(
                filter((res: HttpResponse<IPunctuation[]>) => res.ok),
                map((res: HttpResponse<IPunctuation[]>) => res.body)
            )
            .subscribe(
                (res: IPunctuation[]) => {
                    this.punctuations = res;
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
        this.registerChangeInPunctuations();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPunctuation) {
        return item.id;
    }

    registerChangeInPunctuations() {
        this.eventSubscriber = this.eventManager.subscribe('punctuationListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
