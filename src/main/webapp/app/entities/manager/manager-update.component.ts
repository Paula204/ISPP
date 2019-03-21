import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IManager } from 'app/shared/model/manager.model';
import { ManagerService } from './manager.service';
import { IFree } from 'app/shared/model/free.model';
import { FreeService } from 'app/entities/free';
import { IPremium } from 'app/shared/model/premium.model';
import { PremiumService } from 'app/entities/premium';
import { ISponsor } from 'app/shared/model/sponsor.model';
import { SponsorService } from 'app/entities/sponsor';

@Component({
    selector: 'jhi-manager-update',
    templateUrl: './manager-update.component.html'
})
export class ManagerUpdateComponent implements OnInit {
    manager: IManager;
    isSaving: boolean;

    frees: IFree[];

    premiums: IPremium[];

    sponsors: ISponsor[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected managerService: ManagerService,
        protected freeService: FreeService,
        protected premiumService: PremiumService,
        protected sponsorService: SponsorService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ manager }) => {
            this.manager = manager;
        });
        this.freeService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IFree[]>) => mayBeOk.ok),
                map((response: HttpResponse<IFree[]>) => response.body)
            )
            .subscribe((res: IFree[]) => (this.frees = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.premiumService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IPremium[]>) => mayBeOk.ok),
                map((response: HttpResponse<IPremium[]>) => response.body)
            )
            .subscribe((res: IPremium[]) => (this.premiums = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.sponsorService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ISponsor[]>) => mayBeOk.ok),
                map((response: HttpResponse<ISponsor[]>) => response.body)
            )
            .subscribe((res: ISponsor[]) => (this.sponsors = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.manager.id !== undefined) {
            this.subscribeToSaveResponse(this.managerService.update(this.manager));
        } else {
            this.subscribeToSaveResponse(this.managerService.create(this.manager));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IManager>>) {
        result.subscribe((res: HttpResponse<IManager>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackFreeById(index: number, item: IFree) {
        return item.id;
    }

    trackPremiumById(index: number, item: IPremium) {
        return item.id;
    }

    trackSponsorById(index: number, item: ISponsor) {
        return item.id;
    }
}
