import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { SponsorListComponent } from './sponsor-list.component';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { SponsorDetailComponent } from 'app/sponsor-list/sponsor-detail.component';
import { ITournament, Tournament } from 'app/shared/model/tournament.model';
import { TournamentService } from 'app/entities/tournament';

@Injectable({ providedIn: 'root' })
export class SponsorListResolve implements Resolve<ITournament[]> {
    constructor(private service: TournamentService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITournament[]> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.tournamentsByUser(id).pipe(
                filter((response: HttpResponse<Tournament[]>) => response.ok),
                map((tournament: HttpResponse<Tournament[]>) => tournament.body)
            );
        }
        return of([]);
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
    },
    {
        path: 'sponsor-list/:id',
        component: SponsorDetailComponent,
        resolve: {
            tournaments: SponsorListResolve
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            defaultSort: 'id,asc',
            pageTitle: 'thorneoApp.tournament.home.title2'
        },
        canActivate: [UserRouteAccessService]
    }
];
