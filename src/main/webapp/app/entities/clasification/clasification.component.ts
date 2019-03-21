import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IClasification } from 'app/shared/model/clasification.model';
import { AccountService } from 'app/core';
import { ClasificationService } from './clasification.service';

@Component({
    selector: 'jhi-clasification',
    templateUrl: './clasification.component.html'
})
export class ClasificationComponent implements OnInit, OnDestroy {
    clasifications: IClasification[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected clasificationService: ClasificationService,
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
            this.clasificationService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IClasification[]>) => res.ok),
                    map((res: HttpResponse<IClasification[]>) => res.body)
                )
                .subscribe((res: IClasification[]) => (this.clasifications = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.clasificationService
            .query()
            .pipe(
                filter((res: HttpResponse<IClasification[]>) => res.ok),
                map((res: HttpResponse<IClasification[]>) => res.body)
            )
            .subscribe(
                (res: IClasification[]) => {
                    this.clasifications = res;
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
        this.registerChangeInClasifications();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IClasification) {
        return item.id;
    }

    registerChangeInClasifications() {
        this.eventSubscriber = this.eventManager.subscribe('clasificationListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
