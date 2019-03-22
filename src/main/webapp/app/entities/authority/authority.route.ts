import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Authority } from 'app/shared/model/authority.model';
import { AuthorityService } from './authority.service';
import { AuthorityComponent } from './authority.component';
import { AuthorityDetailComponent } from './authority-detail.component';
import { AuthorityUpdateComponent } from './authority-update.component';
import { AuthorityDeletePopupComponent } from './authority-delete-dialog.component';
import { IAuthority } from 'app/shared/model/authority.model';

@Injectable({ providedIn: 'root' })
export class AuthorityResolve implements Resolve<IAuthority> {
    constructor(private service: AuthorityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAuthority> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Authority>) => response.ok),
                map((authority: HttpResponse<Authority>) => authority.body)
            );
        }
        return of(new Authority());
    }
}

export const authorityRoute: Routes = [
    {
        path: '',
        component: AuthorityComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.authority.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: AuthorityDetailComponent,
        resolve: {
            authority: AuthorityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.authority.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: AuthorityUpdateComponent,
        resolve: {
            authority: AuthorityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.authority.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: AuthorityUpdateComponent,
        resolve: {
            authority: AuthorityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.authority.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const authorityPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: AuthorityDeletePopupComponent,
        resolve: {
            authority: AuthorityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.authority.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
