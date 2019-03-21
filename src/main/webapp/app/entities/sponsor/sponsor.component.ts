import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ISponsor } from 'app/shared/model/sponsor.model';
import { AccountService } from 'app/core';
import { SponsorService } from './sponsor.service';

@Component({
    selector: 'jhi-sponsor',
    templateUrl: './sponsor.component.html'
})
export class SponsorComponent implements OnInit, OnDestroy {
    sponsors: ISponsor[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected sponsorService: SponsorService,
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
            this.sponsorService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<ISponsor[]>) => res.ok),
                    map((res: HttpResponse<ISponsor[]>) => res.body)
                )
                .subscribe((res: ISponsor[]) => (this.sponsors = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.sponsorService
            .query()
            .pipe(
                filter((res: HttpResponse<ISponsor[]>) => res.ok),
                map((res: HttpResponse<ISponsor[]>) => res.body)
            )
            .subscribe(
                (res: ISponsor[]) => {
                    this.sponsors = res;
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
        this.registerChangeInSponsors();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ISponsor) {
        return item.id;
    }

    registerChangeInSponsors() {
        this.eventSubscriber = this.eventManager.subscribe('sponsorListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
