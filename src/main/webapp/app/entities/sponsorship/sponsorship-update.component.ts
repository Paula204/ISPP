import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ISponsorship } from 'app/shared/model/sponsorship.model';
import { SponsorshipService } from './sponsorship.service';
import { ISponsor } from 'app/shared/model/sponsor.model';
import { SponsorService } from 'app/entities/sponsor';
import { ITournament } from 'app/shared/model/tournament.model';
import { TournamentService } from 'app/entities/tournament';

@Component({
    selector: 'jhi-sponsorship-update',
    templateUrl: './sponsorship-update.component.html'
})
export class SponsorshipUpdateComponent implements OnInit {
    sponsorship: ISponsorship;
    isSaving: boolean;

    sponsors: ISponsor[];

    tournaments: ITournament[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected sponsorshipService: SponsorshipService,
        protected sponsorService: SponsorService,
        protected tournamentService: TournamentService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ sponsorship }) => {
            this.sponsorship = sponsorship;
        });
        this.sponsorService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ISponsor[]>) => mayBeOk.ok),
                map((response: HttpResponse<ISponsor[]>) => response.body)
            )
            .subscribe((res: ISponsor[]) => (this.sponsors = res), (res: HttpErrorResponse) => this.onError(res.message));
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
        if (this.sponsorship.id !== undefined) {
            this.subscribeToSaveResponse(this.sponsorshipService.update(this.sponsorship));
        } else {
            this.subscribeToSaveResponse(this.sponsorshipService.create(this.sponsorship));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ISponsorship>>) {
        result.subscribe((res: HttpResponse<ISponsorship>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackTournamentById(index: number, item: ITournament) {
        return item.id;
    }
}
