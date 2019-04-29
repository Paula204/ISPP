import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPunctuation } from 'app/shared/model/punctuation.model';
import { AccountService } from 'app/core';
import { PunctuationService } from './punctuation.service';
import { ITournament } from 'app/shared/model/tournament.model';

@Component({
    selector: 'jhi-punctuation',
    templateUrl: './punctuation.component.html'
})
export class PunctuationTournamentComponent implements OnInit, OnDestroy {
    punctuations: IPunctuation[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    tournament: ITournament;

    constructor(
        protected punctuationService: PunctuationService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService
    ) {}

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
        this.activatedRoute.data.subscribe(({ tournament }) => {
            this.tournament = tournament;
        });
        this.punctuations = [];
        this.punctuationService.getPunctuations(this.tournament.id).forEach(function(value) {
            this.punctuations.push(value);
        });
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
