import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { ITournament } from 'app/shared/model/tournament.model';
import { TournamentService } from './tournament.service';
import { IUser, UserService } from 'app/core';
import { IGame } from 'app/shared/model/game.model';
import { GameService } from 'app/entities/game';

@Component({
    selector: 'jhi-tournament-update',
    templateUrl: './tournament-update.component.html'
})
export class TournamentUpdateComponent implements OnInit {
    tournament: ITournament;
    isSaving: boolean;

    games: IGame[];
    meetingDate: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected tournamentService: TournamentService,
        protected gameService: GameService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ tournament }) => {
            this.tournament = tournament;
            this.meetingDate = this.tournament.meetingDate != null ? this.tournament.meetingDate.format(DATE_TIME_FORMAT) : null;
        });
        this.gameService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IGame[]>) => mayBeOk.ok),
                map((response: HttpResponse<IGame[]>) => response.body)
            )
            .subscribe((res: IGame[]) => (this.games = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.tournament.meetingDate = this.meetingDate != null ? moment(this.meetingDate, DATE_TIME_FORMAT) : null;
        if (this.tournament.id !== undefined) {
            this.subscribeToSaveResponse(this.tournamentService.update(this.tournament));
        } else {
            this.subscribeToSaveResponse(this.tournamentService.create(this.tournament));
        }
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

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    trackGameById(index: number, item: IGame) {
        return item.id;
    }
}
