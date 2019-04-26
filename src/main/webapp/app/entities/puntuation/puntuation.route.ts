import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Puntuation } from 'app/shared/model/puntuation.model';
import { PuntuationService } from './puntuation.service';
import { PuntuationComponent } from './puntuation.component';
import { PuntuationDetailComponent } from './puntuation-detail.component';
import { PuntuationUpdateComponent } from './puntuation-update.component';
import { PuntuationDeletePopupComponent } from './puntuation-delete-dialog.component';
import { IPuntuation } from 'app/shared/model/puntuation.model';

@Injectable({ providedIn: 'root' })
export class PuntuationResolve implements Resolve<IPuntuation> {
    constructor(private service: PuntuationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPuntuation> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Puntuation>) => response.ok),
                map((puntuation: HttpResponse<Puntuation>) => puntuation.body)
            );
        }
        return of(new Puntuation());
    }
}

export const puntuationRoute: Routes = [
    {
        path: '',
        component: PuntuationComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.puntuation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PuntuationDetailComponent,
        resolve: {
            puntuation: PuntuationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.puntuation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PuntuationUpdateComponent,
        resolve: {
            puntuation: PuntuationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.puntuation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PuntuationUpdateComponent,
        resolve: {
            puntuation: PuntuationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.puntuation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const puntuationPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PuntuationDeletePopupComponent,
        resolve: {
            puntuation: PuntuationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.puntuation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
