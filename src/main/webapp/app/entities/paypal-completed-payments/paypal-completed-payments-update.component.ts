import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IPaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';
import { PaypalCompletedPaymentsService } from './paypal-completed-payments.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-paypal-completed-payments-update',
    templateUrl: './paypal-completed-payments-update.component.html'
})
export class PaypalCompletedPaymentsUpdateComponent implements OnInit {
    paypalCompletedPayments: IPaypalCompletedPayments;
    isSaving: boolean;

    users: IUser[];
    date: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected paypalCompletedPaymentsService: PaypalCompletedPaymentsService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ paypalCompletedPayments }) => {
            this.paypalCompletedPayments = paypalCompletedPayments;
            this.date = this.paypalCompletedPayments.date != null ? this.paypalCompletedPayments.date.format(DATE_TIME_FORMAT) : null;
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
        this.paypalCompletedPayments.date = this.date != null ? moment(this.date, DATE_TIME_FORMAT) : null;
        if (this.paypalCompletedPayments.id !== undefined) {
            this.subscribeToSaveResponse(this.paypalCompletedPaymentsService.update(this.paypalCompletedPayments));
        } else {
            this.subscribeToSaveResponse(this.paypalCompletedPaymentsService.create(this.paypalCompletedPayments));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaypalCompletedPayments>>) {
        result.subscribe(
            (res: HttpResponse<IPaypalCompletedPayments>) => this.onSaveSuccess(),
            (res: HttpErrorResponse) => this.onSaveError()
        );
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
