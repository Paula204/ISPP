import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITournament } from 'app/shared/model/tournament.model';
import { AccountService } from 'app/core';
import { TournamentService } from './tournament.service';

@Component({
    selector: 'jhi-tournament',
    templateUrl: './tournament.component.html'
})
export class TournamentComponent implements OnInit, OnDestroy {
    tournaments: ITournament[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected tournamentService: TournamentService,
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
            this.tournamentService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<ITournament[]>) => res.ok),
                    map((res: HttpResponse<ITournament[]>) => res.body)
                )
                .subscribe((res: ITournament[]) => (this.tournaments = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.tournamentService
            .query()
            .pipe(
                filter((res: HttpResponse<ITournament[]>) => res.ok),
                map((res: HttpResponse<ITournament[]>) => res.body)
            )
            .subscribe(
                (res: ITournament[]) => {
                    this.tournaments = res;
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
        this.registerChangeInTournaments();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITournament) {
        return item.id;
    }

    registerChangeInTournaments() {
        this.eventSubscriber = this.eventManager.subscribe('tournamentListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
