import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IParticipation } from 'app/shared/model/participation.model';
import { ParticipationService } from './participation.service';
import { ITournament } from 'app/shared/model/tournament.model';
import { TournamentService } from 'app/entities/tournament';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-participation-update',
    templateUrl: './participation-update.component.html'
})
export class ParticipationUpdateComponent implements OnInit {
    participation: IParticipation;
    isSaving: boolean;

    tournaments: ITournament[];

    users: IUser[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected participationService: ParticipationService,
        protected tournamentService: TournamentService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ participation }) => {
            this.participation = participation;
        });
        this.tournamentService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ITournament[]>) => mayBeOk.ok),
                map((response: HttpResponse<ITournament[]>) => response.body)
            )
            .subscribe((res: ITournament[]) => (this.tournaments = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.participation.id !== undefined) {
            this.subscribeToSaveResponse(this.participationService.update(this.participation));
        } else {
            this.subscribeToSaveResponse(this.participationService.create(this.participation));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IParticipation>>) {
        result.subscribe((res: HttpResponse<IParticipation>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackTournamentById(index: number, item: ITournament) {
        return item.id;
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
