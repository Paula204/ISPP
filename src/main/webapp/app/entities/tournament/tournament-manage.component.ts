import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITournament, ITournamentForm, Tournament } from 'app/shared/model/tournament.model';
import { TournamentService } from '.';
import { ParticipationService } from 'app/entities/participation';
import { Observable } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';
import { Account, AccountService } from 'app/core';
import * as $ from 'jquery';
//import * as bracket from "jquery-bracket";

@Component({
    selector: 'jhi-tournament-manage',
    templateUrl: './tournament-manage.component.html'
})
export class TournamentManageComponent implements OnInit {
    tournament: ITournamentForm;

    currentAccount: Account;
    currentDate: Date;

    isSaving: boolean;

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

        $(function() {
            alert('Hello');
        });
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
}
