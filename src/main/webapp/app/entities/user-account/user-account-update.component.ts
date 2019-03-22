import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IUserAccount } from 'app/shared/model/user-account.model';
import { UserAccountService } from './user-account.service';
import { IAuthority } from 'app/shared/model/authority.model';
import { AuthorityService } from 'app/entities/authority';

@Component({
    selector: 'jhi-user-account-update',
    templateUrl: './user-account-update.component.html'
})
export class UserAccountUpdateComponent implements OnInit {
    userAccount: IUserAccount;
    isSaving: boolean;

    authorities: IAuthority[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected userAccountService: UserAccountService,
        protected authorityService: AuthorityService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ userAccount }) => {
            this.userAccount = userAccount;
        });
        this.authorityService
            .query({ filter: 'useraccount-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IAuthority[]>) => mayBeOk.ok),
                map((response: HttpResponse<IAuthority[]>) => response.body)
            )
            .subscribe(
                (res: IAuthority[]) => {
                    if (!this.userAccount.authority || !this.userAccount.authority.id) {
                        this.authorities = res;
                    } else {
                        this.authorityService
                            .find(this.userAccount.authority.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IAuthority>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IAuthority>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IAuthority) => (this.authorities = [subRes].concat(res)),
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
        if (this.userAccount.id !== undefined) {
            this.subscribeToSaveResponse(this.userAccountService.update(this.userAccount));
        } else {
            this.subscribeToSaveResponse(this.userAccountService.create(this.userAccount));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserAccount>>) {
        result.subscribe((res: HttpResponse<IUserAccount>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackAuthorityById(index: number, item: IAuthority) {
        return item.id;
    }
}
