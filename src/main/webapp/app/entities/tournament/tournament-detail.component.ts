import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITournament, ITournamentForm, Tournament } from 'app/shared/model/tournament.model';
import { TournamentService } from '.';
import { Observable } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';

@Component({
    selector: 'jhi-tournament-detail',
    templateUrl: './tournament-detail.component.html'
})
export class TournamentDetailComponent implements OnInit {
    tournament: ITournamentForm;
    isSaving: boolean;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected activatedRoute: ActivatedRoute,
        protected tournamentService: TournamentService
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ tournament }) => {
            this.tournament = tournament;
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

        let result: ITournament;
        result = new Tournament();
        result.id = this.tournament.id;
        result.title = this.tournament.title;
        result.description = this.tournament.description;
        result.meetingDate = this.tournament.meetingDate;
        result.meetingPoint = this.tournament.meetingPoint;
        result.city = this.tournament.city;
        result.price = this.tournament.price;
        result.playerSize = this.tournament.playerSize;
        result.rewards = this.tournament.rewards;
        result.imageUrl = this.tournament.imageUrl;
        result.latitude = this.tournament.latitude;
        result.longitude = this.tournament.longitude;
        result.type = this.tournament.type;
        result.participations = this.tournament.participations;
        result.user = this.tournament.user;
        result.game = this.tournament.game;

        this.subscribeToSaveResponse(this.tournamentService.signOn(result));
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
