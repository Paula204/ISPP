import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IActor } from 'app/shared/model/actor.model';
import { ActorService } from './actor.service';
import { IUserAccount } from 'app/shared/model/user-account.model';
import { UserAccountService } from 'app/entities/user-account';

@Component({
    selector: 'jhi-actor-update',
    templateUrl: './actor-update.component.html'
})
export class ActorUpdateComponent implements OnInit {
    actor: IActor;
    isSaving: boolean;

    useraccounts: IUserAccount[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected actorService: ActorService,
        protected userAccountService: UserAccountService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ actor }) => {
            this.actor = actor;
        });
        this.userAccountService
            .query({ filter: 'actor-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IUserAccount[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUserAccount[]>) => response.body)
            )
            .subscribe(
                (res: IUserAccount[]) => {
                    if (!this.actor.userAccount || !this.actor.userAccount.id) {
                        this.useraccounts = res;
                    } else {
                        this.userAccountService
                            .find(this.actor.userAccount.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IUserAccount>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IUserAccount>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IUserAccount) => (this.useraccounts = [subRes].concat(res)),
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
        if (this.actor.id !== undefined) {
            this.subscribeToSaveResponse(this.actorService.update(this.actor));
        } else {
            this.subscribeToSaveResponse(this.actorService.create(this.actor));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IActor>>) {
        result.subscribe((res: HttpResponse<IActor>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackUserAccountById(index: number, item: IUserAccount) {
        return item.id;
    }
}
