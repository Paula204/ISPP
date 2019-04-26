import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPuntuation } from 'app/shared/model/puntuation.model';
import { PuntuationService } from './puntuation.service';
import { ITournament } from 'app/shared/model/tournament.model';
import { TournamentService } from 'app/entities/tournament';
import { IParticipation } from 'app/shared/model/participation.model';
import { ParticipationService } from 'app/entities/participation';

@Component({
    selector: 'jhi-puntuation-update',
    templateUrl: './puntuation-update.component.html'
})
export class PuntuationUpdateComponent implements OnInit {
    puntuation: IPuntuation;
    isSaving: boolean;

    tournaments: ITournament[];

    participations: IParticipation[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected puntuationService: PuntuationService,
        protected tournamentService: TournamentService,
        protected participationService: ParticipationService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ puntuation }) => {
            this.puntuation = puntuation;
        });
        this.tournamentService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ITournament[]>) => mayBeOk.ok),
                map((response: HttpResponse<ITournament[]>) => response.body)
            )
            .subscribe((res: ITournament[]) => (this.tournaments = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.participationService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IParticipation[]>) => mayBeOk.ok),
                map((response: HttpResponse<IParticipation[]>) => response.body)
            )
            .subscribe((res: IParticipation[]) => (this.participations = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.puntuation.id !== undefined) {
            this.subscribeToSaveResponse(this.puntuationService.update(this.puntuation));
        } else {
            this.subscribeToSaveResponse(this.puntuationService.create(this.puntuation));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPuntuation>>) {
        result.subscribe((res: HttpResponse<IPuntuation>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackParticipationById(index: number, item: IParticipation) {
        return item.id;
    }
}
