import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account, AccountService } from 'app/core';
import { EMAIL_ALREADY_USED_TYPE, HasAnyAuthorityDirective, LOGIN_ALREADY_USED_TYPE } from 'app/shared';
import { JhiAlertService } from 'ng-jhipster';
import { IUser, User, UserService } from 'app/core';
import { Observable } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IPaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';

@Component({
    selector: 'jhi-upgrade-user',
    templateUrl: './upgrade-user.component.html',
    styles: []
})
export class UpgradeUserComponent implements OnInit {
    errorUserExists: string;
    error: string;
    isSaving: boolean;
    isSponsor: any;
    isAdmin: any;
    currentAccount: Account;
    currentUser: User;
    eso: string;
    constructor(protected jhiAlertService: JhiAlertService, protected accountService: AccountService, private router: Router) {}

    ngOnInit() {
        this.accountService.hasAuthority('ROLE_SPONSOR').then(role => {
            this.isSponsor = role;
        });
        this.accountService.hasAuthority('ROLE_ADMIN').then(role => {
            this.isAdmin = role;
        });
        this.accountService.identity().then(account => {
            this.currentUser = account;
        });
    }

    payPremium() {
        this.router.navigate(['paypal-payments/premium']);
    }

    paySponsor() {
        this.router.navigate(['paypal-payments/sponsor']);
    }

    cancelSubs() {
        this.accountService.deleteRole(this.currentUser).subscribe(
            () => {
                this.onSaveSuccess();
            },
            () => {
                this.onSaveError();
            }
        );
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        console.log('Cancel subscribe success.');
        window.location.reload();
    }

    protected onSaveError() {
        this.isSaving = false;
        console.log('Fail to cancel subscribe.');
    }
}
