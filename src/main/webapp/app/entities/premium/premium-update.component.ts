import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPremium } from 'app/shared/model/premium.model';
import { PremiumService } from './premium.service';
import { IActor } from 'app/shared/model/actor.model';
import { ActorService } from 'app/entities/actor';
import { ITournament } from 'app/shared/model/tournament.model';
import { TournamentService } from 'app/entities/tournament';

@Component({
    selector: 'jhi-premium-update',
    templateUrl: './premium-update.component.html'
})
export class PremiumUpdateComponent implements OnInit {
    premium: IPremium;
    isSaving: boolean;

    actors: IActor[];

    tournaments: ITournament[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected premiumService: PremiumService,
        protected actorService: ActorService,
        protected tournamentService: TournamentService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ premium }) => {
            this.premium = premium;
        });
        this.actorService
            .query({ filter: 'premium-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IActor[]>) => mayBeOk.ok),
                map((response: HttpResponse<IActor[]>) => response.body)
            )
            .subscribe(
                (res: IActor[]) => {
                    if (!this.premium.actor || !this.premium.actor.id) {
                        this.actors = res;
                    } else {
                        this.actorService
                            .find(this.premium.actor.id)
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
        if (this.premium.id !== undefined) {
            this.subscribeToSaveResponse(this.premiumService.update(this.premium));
        } else {
            this.subscribeToSaveResponse(this.premiumService.create(this.premium));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPremium>>) {
        result.subscribe((res: HttpResponse<IPremium>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
