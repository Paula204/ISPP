import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITournament, ITournamentForm, Tournament } from 'app/shared/model/tournament.model';
import { TournamentService } from '.';
import { ParticipationService } from 'app/entities/participation';
import { Observable } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';
import { Account, AccountService } from 'app/core';
import { IParticipation, Participation } from 'app/shared/model/participation.model';
import { templateSourceUrl } from '@angular/compiler';
// import * as $ from 'jquery';
declare let $: any;

@Component({
    selector: 'jhi-tournament-manage-group',
    templateUrl: './tournament-manage-group.component.html'
})
export class TournamentManageGroupComponent implements OnInit {
    public hora: 0;
    public minuto: 0;
    public segundos: 0;
    public collection: Array<any> = [];
    public contador: any;

    tournament: ITournamentForm;

    currentAccount: Account;
    currentDate: Date;

    isSaving: boolean;
    p: IParticipation[];
    i: number;
    l: number;
    participation: Participation;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService,
        protected tournamentService: TournamentService,
        protected participationService: ParticipationService
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ tournament }) => {
            this.tournament = tournament;
        });
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.currentDate = new Date();
    }

    previousState() {
        window.history.back();
    }

    signOn() {
        this.isSaving = true;
        if (this.tournament.participations === null) {
            this.tournament.participations = [];
        }
        this.subscribeToSaveResponse(this.tournamentService.signOn(this.tournament));
    }

    close() {
        this.isSaving = true;
        this.subscribeToSaveResponse(this.tournamentService.close(this.tournament));
    }

    disqualify(id: number) {
        this.isSaving = true;
        this.subscribeToSaveResponse(this.participationService.disqualify(id));
    }

    win(id: number) {
        this.isSaving = true;
        this.subscribeToSaveResponse(this.participationService.win(id));
    }

    tie(id: number) {
        this.isSaving = true;
        this.subscribeToSaveResponse(this.participationService.tie(id));
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ITournament>>) {
        result.subscribe((res: HttpResponse<ITournament>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    start() {
        if (this.contador === null || this.contador === undefined) {
            this.contador = setInterval(() => {
                this.segundos += 1;
                if (this.segundos === 60) {
                    this.minuto += 1;
                    this.segundos = 0;
                    if (this.minuto === 60) {
                        this.hora += 1;
                        this.minuto = 0;
                        if (this.hora === 24) {
                            this.hora = 0;
                        }
                    }
                }
            }, 1000);
        }
    }
    lapso() {
        //  this.horaLapso = this.hora;
        //  this.minutoLapso = this.minuto;
        //  this.segundoLapso = this.segundos;
        const obj: any = {};
        obj.hora = this.hora;
        obj.minuto = this.minuto;
        obj.segundos = this.segundos;
        this.collection.push(obj);
    }
    stop() {
        clearInterval(this.contador);
        this.hora = 0;
        this.minuto = 0;
        this.segundos = 0;
        this.contador = null;
    }
}
