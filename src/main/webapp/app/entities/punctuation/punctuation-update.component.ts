import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPunctuation } from 'app/shared/model/punctuation.model';
import { PunctuationService } from './punctuation.service';
import { ITournament } from 'app/shared/model/tournament.model';
import { TournamentService } from 'app/entities/tournament';
import { IParticipation } from 'app/shared/model/participation.model';
import { ParticipationService } from 'app/entities/participation';

@Component({
    selector: 'jhi-punctuation-update',
    templateUrl: './punctuation-update.component.html'
})
export class PunctuationUpdateComponent implements OnInit {
    punctuation: IPunctuation;
    isSaving: boolean;

    tournaments: ITournament[];

    participations: IParticipation[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected punctuationService: PunctuationService,
        protected tournamentService: TournamentService,
        protected participationService: ParticipationService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ punctuation }) => {
            this.punctuation = punctuation;
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
        if (this.punctuation.id !== undefined) {
            this.subscribeToSaveResponse(this.punctuationService.update(this.punctuation));
        } else {
            this.subscribeToSaveResponse(this.punctuationService.create(this.punctuation));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPunctuation>>) {
        result.subscribe((res: HttpResponse<IPunctuation>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
