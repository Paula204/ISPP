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
import { ISponsor } from 'app/shared/model/sponsor.model';
import { SponsorService } from 'app/entities/sponsor';
import { IPremium } from 'app/shared/model/premium.model';
import { PremiumService } from 'app/entities/premium';
import { IFree } from 'app/shared/model/free.model';
import { FreeService } from 'app/entities/free';
import { IGame } from 'app/shared/model/game.model';
import { GameService } from 'app/entities/game';

@Component({
    selector: 'jhi-tournament-update',
    templateUrl: './tournament-update.component.html'
})
export class TournamentUpdateComponent implements OnInit {
    tournament: ITournament;
    isSaving: boolean;

    sponsors: ISponsor[];

    premiums: IPremium[];

    frees: IFree[];

    games: IGame[];
    meetingDate: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected tournamentService: TournamentService,
        protected sponsorService: SponsorService,
        protected premiumService: PremiumService,
        protected freeService: FreeService,
        protected gameService: GameService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ tournament }) => {
            this.tournament = tournament;
            this.meetingDate = this.tournament.meetingDate != null ? this.tournament.meetingDate.format(DATE_TIME_FORMAT) : null;
        });
        this.sponsorService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ISponsor[]>) => mayBeOk.ok),
                map((response: HttpResponse<ISponsor[]>) => response.body)
            )
            .subscribe((res: ISponsor[]) => (this.sponsors = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.premiumService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IPremium[]>) => mayBeOk.ok),
                map((response: HttpResponse<IPremium[]>) => response.body)
            )
            .subscribe((res: IPremium[]) => (this.premiums = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.freeService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IFree[]>) => mayBeOk.ok),
                map((response: HttpResponse<IFree[]>) => response.body)
            )
            .subscribe((res: IFree[]) => (this.frees = res), (res: HttpErrorResponse) => this.onError(res.message));
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

    trackSponsorById(index: number, item: ISponsor) {
        return item.id;
    }

    trackPremiumById(index: number, item: IPremium) {
        return item.id;
    }

    trackFreeById(index: number, item: IFree) {
        return item.id;
    }

    trackGameById(index: number, item: IGame) {
        return item.id;
    }
}
