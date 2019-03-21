import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IParticipant } from 'app/shared/model/participant.model';
import { AccountService } from 'app/core';
import { ParticipantService } from './participant.service';

@Component({
    selector: 'jhi-participant',
    templateUrl: './participant.component.html'
})
export class ParticipantComponent implements OnInit, OnDestroy {
    participants: IParticipant[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected participantService: ParticipantService,
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
            this.participantService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IParticipant[]>) => res.ok),
                    map((res: HttpResponse<IParticipant[]>) => res.body)
                )
                .subscribe((res: IParticipant[]) => (this.participants = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.participantService
            .query()
            .pipe(
                filter((res: HttpResponse<IParticipant[]>) => res.ok),
                map((res: HttpResponse<IParticipant[]>) => res.body)
            )
            .subscribe(
                (res: IParticipant[]) => {
                    this.participants = res;
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
        this.registerChangeInParticipants();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IParticipant) {
        return item.id;
    }

    registerChangeInParticipants() {
        this.eventSubscriber = this.eventManager.subscribe('participantListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
