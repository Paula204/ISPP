import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ISponsorship } from 'app/shared/model/sponsorship.model';
import { SponsorshipService } from './sponsorship.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-sponsorship-update',
    templateUrl: './sponsorship-update.component.html'
})
export class SponsorshipUpdateComponent implements OnInit {
    sponsorship: ISponsorship;
    isSaving: boolean;

    users: IUser[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected sponsorshipService: SponsorshipService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ sponsorship }) => {
            this.sponsorship = sponsorship;
        });
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

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
