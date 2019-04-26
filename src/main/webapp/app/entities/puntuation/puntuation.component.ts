import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPuntuation } from 'app/shared/model/puntuation.model';
import { AccountService } from 'app/core';
import { PuntuationService } from './puntuation.service';

@Component({
    selector: 'jhi-puntuation',
    templateUrl: './puntuation.component.html'
})
export class PuntuationComponent implements OnInit, OnDestroy {
    puntuations: IPuntuation[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected puntuationService: PuntuationService,
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
            this.puntuationService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IPuntuation[]>) => res.ok),
                    map((res: HttpResponse<IPuntuation[]>) => res.body)
                )
                .subscribe((res: IPuntuation[]) => (this.puntuations = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.puntuationService
            .query()
            .pipe(
                filter((res: HttpResponse<IPuntuation[]>) => res.ok),
                map((res: HttpResponse<IPuntuation[]>) => res.body)
            )
            .subscribe(
                (res: IPuntuation[]) => {
                    this.puntuations = res;
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
        this.registerChangeInPuntuations();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPuntuation) {
        return item.id;
    }

    registerChangeInPuntuations() {
        this.eventSubscriber = this.eventManager.subscribe('puntuationListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
