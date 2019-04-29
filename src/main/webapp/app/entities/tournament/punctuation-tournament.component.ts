import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPunctuation } from 'app/shared/model/punctuation.model';
import { AccountService } from 'app/core';
import { PunctuationService } from '../punctuation/punctuation.service';
import { ITournament, ITournamentForm } from 'app/shared/model/tournament.model';
import { TournamentService } from 'app/entities/tournament';

@Component({
    selector: 'jhi-punctuation',
    templateUrl: './punctuation-tournament.component.html'
})
export class PunctuationTournamentComponent implements OnInit, OnDestroy {
    punctuations: IPunctuation[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    tournament: ITournamentForm;
    route: string;
    idTorneo: number;
    temp: IPunctuation[];

    constructor(
        protected punctuationService: PunctuationService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService,
        protected tournamentService: TournamentService
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.idTorneo = params['idTournament'];
        });
        console.log('Punctuation-tournament.component');
        const res = activatedRoute.snapshot.url.length;
        this.route = activatedRoute.snapshot.url[res - 2].toString();
        this.tournamentService.find(+this.route).subscribe(tournament => {
            this.tournament = tournament.body;
        });
    }

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

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPunctuation) {
        return item.id;
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    registerChangeInPunctuations() {
        this.eventSubscriber = this.eventManager.subscribe('punctuationListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
