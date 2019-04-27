import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';

import { IUser, User, UserRouteAccessService, UserService } from 'app/core';
import { SponsorListComponent } from './sponsor-list.component';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiResolvePagingParams } from 'ng-jhipster';

@Injectable({ providedIn: 'root' })
export class SponsorListResolve implements Resolve<IUser> {
    constructor(private service: UserService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUser> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<User>) => response.ok),
                map((tournament: HttpResponse<User>) => tournament.body)
            );
        }
        return of(new User());
    }
}

export const SPONSOR_LIST_ROUTE: Routes = [
    {
        path: 'sponsor-list',
        component: SponsorListComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            defaultSort: 'id,asc',
            pageTitle: 'thorneoApp.tournament.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];
