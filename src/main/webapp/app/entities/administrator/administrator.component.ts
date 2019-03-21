import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IAdministrator } from 'app/shared/model/administrator.model';
import { AccountService } from 'app/core';
import { AdministratorService } from './administrator.service';

@Component({
    selector: 'jhi-administrator',
    templateUrl: './administrator.component.html'
})
export class AdministratorComponent implements OnInit, OnDestroy {
    administrators: IAdministrator[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected administratorService: AdministratorService,
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
            this.administratorService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IAdministrator[]>) => res.ok),
                    map((res: HttpResponse<IAdministrator[]>) => res.body)
                )
                .subscribe((res: IAdministrator[]) => (this.administrators = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.administratorService
            .query()
            .pipe(
                filter((res: HttpResponse<IAdministrator[]>) => res.ok),
                map((res: HttpResponse<IAdministrator[]>) => res.body)
            )
            .subscribe(
                (res: IAdministrator[]) => {
                    this.administrators = res;
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
        this.registerChangeInAdministrators();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IAdministrator) {
        return item.id;
    }

    registerChangeInAdministrators() {
        this.eventSubscriber = this.eventManager.subscribe('administratorListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
