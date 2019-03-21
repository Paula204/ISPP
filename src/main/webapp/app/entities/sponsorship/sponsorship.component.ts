import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ISponsorship } from 'app/shared/model/sponsorship.model';
import { AccountService } from 'app/core';
import { SponsorshipService } from './sponsorship.service';

@Component({
    selector: 'jhi-sponsorship',
    templateUrl: './sponsorship.component.html'
})
export class SponsorshipComponent implements OnInit, OnDestroy {
    sponsorships: ISponsorship[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected sponsorshipService: SponsorshipService,
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
            this.sponsorshipService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<ISponsorship[]>) => res.ok),
                    map((res: HttpResponse<ISponsorship[]>) => res.body)
                )
                .subscribe((res: ISponsorship[]) => (this.sponsorships = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.sponsorshipService
            .query()
            .pipe(
                filter((res: HttpResponse<ISponsorship[]>) => res.ok),
                map((res: HttpResponse<ISponsorship[]>) => res.body)
            )
            .subscribe(
                (res: ISponsorship[]) => {
                    this.sponsorships = res;
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
        this.registerChangeInSponsorships();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ISponsorship) {
        return item.id;
    }

    registerChangeInSponsorships() {
        this.eventSubscriber = this.eventManager.subscribe('sponsorshipListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
