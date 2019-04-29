import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Punctuation } from 'app/shared/model/punctuation.model';
import { PunctuationService } from './punctuation.service';
import { PunctuationComponent } from './punctuation.component';
import { PunctuationDetailComponent } from './punctuation-detail.component';
import { PunctuationUpdateComponent } from './punctuation-update.component';
import { PunctuationDeletePopupComponent } from './punctuation-delete-dialog.component';
import { IPunctuation } from 'app/shared/model/punctuation.model';


@Injectable({ providedIn: 'root' })
export class PunctuationResolve implements Resolve<IPunctuation> {
    constructor(private service: PunctuationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPunctuation> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Punctuation>) => response.ok),
                map((punctuation: HttpResponse<Punctuation>) => punctuation.body)
            );
        }
        return of(new Punctuation());
    }
}

export const punctuationRoute: Routes = [
    {
        path: '',
        component: PunctuationComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.punctuation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PunctuationDetailComponent,
        resolve: {
            punctuation: PunctuationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.punctuation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PunctuationUpdateComponent,
        resolve: {
            punctuation: PunctuationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.punctuation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PunctuationUpdateComponent,
        resolve: {
            punctuation: PunctuationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.punctuation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/tournament',
        component: PunctuationTournamentComponent,
        resolve: {
            punctuation: PunctuationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.punctuation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const punctuationPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PunctuationDeletePopupComponent,
        resolve: {
            punctuation: PunctuationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.punctuation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
