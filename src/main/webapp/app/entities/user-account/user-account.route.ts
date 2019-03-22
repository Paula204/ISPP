import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserAccount } from 'app/shared/model/user-account.model';
import { UserAccountService } from './user-account.service';
import { UserAccountComponent } from './user-account.component';
import { UserAccountDetailComponent } from './user-account-detail.component';
import { UserAccountUpdateComponent } from './user-account-update.component';
import { UserAccountDeletePopupComponent } from './user-account-delete-dialog.component';
import { IUserAccount } from 'app/shared/model/user-account.model';

@Injectable({ providedIn: 'root' })
export class UserAccountResolve implements Resolve<IUserAccount> {
    constructor(private service: UserAccountService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUserAccount> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<UserAccount>) => response.ok),
                map((userAccount: HttpResponse<UserAccount>) => userAccount.body)
            );
        }
        return of(new UserAccount());
    }
}

export const userAccountRoute: Routes = [
    {
        path: '',
        component: UserAccountComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.userAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: UserAccountDetailComponent,
        resolve: {
            userAccount: UserAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.userAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: UserAccountUpdateComponent,
        resolve: {
            userAccount: UserAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.userAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: UserAccountUpdateComponent,
        resolve: {
            userAccount: UserAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.userAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const userAccountPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: UserAccountDeletePopupComponent,
        resolve: {
            userAccount: UserAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.userAccount.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
