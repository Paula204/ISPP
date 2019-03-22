import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IClasification } from 'app/shared/model/clasification.model';
import { ClasificationService } from './clasification.service';
import { IParticipant } from 'app/shared/model/participant.model';
import { ParticipantService } from 'app/entities/participant';

@Component({
    selector: 'jhi-clasification-update',
    templateUrl: './clasification-update.component.html'
})
export class ClasificationUpdateComponent implements OnInit {
    clasification: IClasification;
    isSaving: boolean;

    participants: IParticipant[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected clasificationService: ClasificationService,
        protected participantService: ParticipantService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ clasification }) => {
            this.clasification = clasification;
        });
        this.participantService
            .query({ filter: 'clasification-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IParticipant[]>) => mayBeOk.ok),
                map((response: HttpResponse<IParticipant[]>) => response.body)
            )
            .subscribe(
                (res: IParticipant[]) => {
                    if (!this.clasification.participant || !this.clasification.participant.id) {
                        this.participants = res;
                    } else {
                        this.participantService
                            .find(this.clasification.participant.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IParticipant>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IParticipant>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IParticipant) => (this.participants = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.clasification.id !== undefined) {
            this.subscribeToSaveResponse(this.clasificationService.update(this.clasification));
        } else {
            this.subscribeToSaveResponse(this.clasificationService.create(this.clasification));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IClasification>>) {
        result.subscribe((res: HttpResponse<IClasification>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackParticipantById(index: number, item: IParticipant) {
        return item.id;
    }
}
