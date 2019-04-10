import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Tournament } from 'app/shared/model/tournament.model';
import { TournamentService } from './tournament.service';
import { TournamentComponent } from './tournament.component';
import { TournamentMyComponent } from './tournament-my.component';
import { TournamentDetailComponent } from './tournament-detail.component';
import { TournamentManageComponent } from './tournament-manage.component';
import { TournamentManageGroupComponent } from './tournament-manage-group.component';

import { TournamentUpdateComponent } from './tournament-update.component';
import { TournamentDeletePopupComponent } from './tournament-delete-dialog.component';
import { ITournament } from 'app/shared/model/tournament.model';
import { TournamentManagerComponent } from './tournament-manager.component';

@Injectable({ providedIn: 'root' })
export class TournamentResolve implements Resolve<ITournament> {
    constructor(private service: TournamentService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITournament> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Tournament>) => response.ok),
                map((tournament: HttpResponse<Tournament>) => tournament.body)
            );
        }
        return of(new Tournament());
    }
}

export const tournamentRoute: Routes = [
    {
        path: '',
        component: TournamentComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            defaultSort: 'id,asc',
            pageTitle: 'thorneoApp.tournament.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my',
        component: TournamentMyComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            defaultSort: 'id,asc',
            pageTitle: 'thorneoApp.tournament.home.title2'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: TournamentDetailComponent,
        resolve: {
            tournament: TournamentResolve
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'thorneoApp.tournament.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: TournamentUpdateComponent,
        resolve: {
            tournament: TournamentResolve
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'thorneoApp.tournament.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: TournamentUpdateComponent,
        resolve: {
            tournament: TournamentResolve
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'thorneoApp.tournament.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/manage',
        component: TournamentManageComponent,
        resolve: {
            tournament: TournamentResolve
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'thorneoApp.tournament.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/manager',
        component: TournamentManagerComponent,
        resolve: {
            tournament: TournamentResolve
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'thorneoApp.tournament.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/manage-group',
        component: TournamentManageGroupComponent,
        resolve: {
            tournament: TournamentResolve
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'thorneoApp.tournament.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const tournamentPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: TournamentDeletePopupComponent,
        resolve: {
            tournament: TournamentResolve
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'thorneoApp.tournament.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
