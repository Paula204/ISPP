import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IParticipation } from 'app/shared/model/participation.model';
import { AccountService } from 'app/core';
import { ParticipationService } from './participation.service';
import { ISponsorship, Sponsorship } from 'app/shared/model/sponsorship.model';
import { SponsorshipService } from 'app/entities/sponsorship';

@Component({
    selector: 'jhi-participation',
    templateUrl: './participation.component.html'
})
export class ParticipationComponent implements OnInit, OnDestroy {
    participations: IParticipation[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    sponsorship: ISponsorship;

    constructor(
        protected participationService: ParticipationService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService,
        protected sponsorshipService: SponsorshipService
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.participationService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IParticipation[]>) => res.ok),
                    map((res: HttpResponse<IParticipation[]>) => res.body)
                )
                .subscribe((res: IParticipation[]) => (this.participations = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.participationService
            .query()
            .pipe(
                filter((res: HttpResponse<IParticipation[]>) => res.ok),
                map((res: HttpResponse<IParticipation[]>) => res.body)
            )
            .subscribe(
                (res: IParticipation[]) => {
                    this.participations = res;
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
        this.registerChangeInParticipations();
        this.sponsorshipService
            .findRandom()
            .pipe(
                filter((response: HttpResponse<Sponsorship>) => response.ok),
                map((sponsorship: HttpResponse<Sponsorship>) => sponsorship.body)
            )
            .subscribe(value => (this.sponsorship = value));
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IParticipation) {
        return item.id;
    }

    registerChangeInParticipations() {
        this.eventSubscriber = this.eventManager.subscribe('participationListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
