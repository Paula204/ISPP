import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPromotion } from 'app/shared/model/promotion.model';
import { PromotionService } from './promotion.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-promotion-update',
    templateUrl: './promotion-update.component.html'
})
export class PromotionUpdateComponent implements OnInit {
    promotion: IPromotion;
    isSaving: boolean;

    users: IUser[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected promotionService: PromotionService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ promotion }) => {
            this.promotion = promotion;
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
        if (this.promotion.id !== undefined) {
            this.subscribeToSaveResponse(this.promotionService.update(this.promotion));
        } else {
            this.subscribeToSaveResponse(this.promotionService.create(this.promotion));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPromotion>>) {
        result.subscribe((res: HttpResponse<IPromotion>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
