import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IFree } from 'app/shared/model/free.model';
import { FreeService } from './free.service';
import { IActor } from 'app/shared/model/actor.model';
import { ActorService } from 'app/entities/actor';
import { ITournament } from 'app/shared/model/tournament.model';
import { TournamentService } from 'app/entities/tournament';

@Component({
    selector: 'jhi-free-update',
    templateUrl: './free-update.component.html'
})
export class FreeUpdateComponent implements OnInit {
    free: IFree;
    isSaving: boolean;

    actors: IActor[];

    tournaments: ITournament[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected freeService: FreeService,
        protected actorService: ActorService,
        protected tournamentService: TournamentService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ free }) => {
            this.free = free;
        });
        this.actorService
            .query({ filter: 'free-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IActor[]>) => mayBeOk.ok),
                map((response: HttpResponse<IActor[]>) => response.body)
            )
            .subscribe(
                (res: IActor[]) => {
                    if (!this.free.actor || !this.free.actor.id) {
                        this.actors = res;
                    } else {
                        this.actorService
                            .find(this.free.actor.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IActor>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IActor>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IActor) => (this.actors = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        this.tournamentService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ITournament[]>) => mayBeOk.ok),
                map((response: HttpResponse<ITournament[]>) => response.body)
            )
            .subscribe((res: ITournament[]) => (this.tournaments = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.free.id !== undefined) {
            this.subscribeToSaveResponse(this.freeService.update(this.free));
        } else {
            this.subscribeToSaveResponse(this.freeService.create(this.free));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IFree>>) {
        result.subscribe((res: HttpResponse<IFree>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackActorById(index: number, item: IActor) {
        return item.id;
    }

    trackTournamentById(index: number, item: ITournament) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
