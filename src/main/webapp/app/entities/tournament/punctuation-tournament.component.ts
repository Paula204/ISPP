import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPunctuation } from 'app/shared/model/punctuation.model';
import { AccountService } from 'app/core';
import { PunctuationService } from '../punctuation/punctuation.service';
import { ITournament, ITournamentForm } from 'app/shared/model/tournament.model';
import { TournamentService } from 'app/entities/tournament';
import { TournamentManageComponent } from './tournament-manage.component';

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
    hayGanador: boolean;
    hayEmpate: boolean;
    indice: number;

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
        this.hayGanador = false;
        this.hayEmpate = false;
        this.indice = 0;
        this.tournamentService.getPunctuations(+this.route).subscribe(punctuations => {
            this.punctuations = punctuations.body;
            for (const p of this.punctuations) {
                if (p.participation.punctuation === 10000) {
                    this.hayGanador = true;
                    break;
                }

                if (this.indice % 2 == 0 && this.indice < this.punctuations.length) {
                    const t = this.punctuations[this.indice + 1];
                    if (p.points == t.points) {
                        this.hayEmpate = true;
                    }
                }
                this.indice++;
            }
        });
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.tournamentService.find(+this.route).subscribe(tournamet => {
            this.tournament = tournamet.body;
        });

        //si ganador redirige a crono
    }

    ngOnDestroy() {
        window.location.reload();
    }

    previousState() {
        window.location.reload();
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

    avanzarRonda() {
        this.subscribeToSaveResponse(this.tournamentService.advanceRound(+this.route));
    }

    protected subscribeToSaveResponse(result: Observable<IPunctuation[]>) {
        result.subscribe((res: IPunctuation[]) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.ngOnInit();
    }

    protected onSaveError() {}
}
