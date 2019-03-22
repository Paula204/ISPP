import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IAuthority } from 'app/shared/model/authority.model';
import { AccountService } from 'app/core';
import { AuthorityService } from './authority.service';

@Component({
    selector: 'jhi-authority',
    templateUrl: './authority.component.html'
})
export class AuthorityComponent implements OnInit, OnDestroy {
    authorities: IAuthority[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected authorityService: AuthorityService,
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
            this.authorityService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IAuthority[]>) => res.ok),
                    map((res: HttpResponse<IAuthority[]>) => res.body)
                )
                .subscribe((res: IAuthority[]) => (this.authorities = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.authorityService
            .query()
            .pipe(
                filter((res: HttpResponse<IAuthority[]>) => res.ok),
                map((res: HttpResponse<IAuthority[]>) => res.body)
            )
            .subscribe(
                (res: IAuthority[]) => {
                    this.authorities = res;
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
        this.registerChangeInAuthorities();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IAuthority) {
        return item.id;
    }

    registerChangeInAuthorities() {
        this.eventSubscriber = this.eventManager.subscribe('authorityListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
