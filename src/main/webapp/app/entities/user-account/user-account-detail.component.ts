import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserAccount } from 'app/shared/model/user-account.model';

@Component({
    selector: 'jhi-user-account-detail',
    templateUrl: './user-account-detail.component.html'
})
export class UserAccountDetailComponent implements OnInit {
    userAccount: IUserAccount;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ userAccount }) => {
            this.userAccount = userAccount;
        });
    }

    previousState() {
        window.history.back();
    }
}
