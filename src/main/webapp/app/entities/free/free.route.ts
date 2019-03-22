import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Free } from 'app/shared/model/free.model';
import { FreeService } from './free.service';
import { FreeComponent } from './free.component';
import { FreeDetailComponent } from './free-detail.component';
import { FreeUpdateComponent } from './free-update.component';
import { FreeDeletePopupComponent } from './free-delete-dialog.component';
import { IFree } from 'app/shared/model/free.model';

@Injectable({ providedIn: 'root' })
export class FreeResolve implements Resolve<IFree> {
    constructor(private service: FreeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IFree> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Free>) => response.ok),
                map((free: HttpResponse<Free>) => free.body)
            );
        }
        return of(new Free());
    }
}

export const freeRoute: Routes = [
    {
        path: '',
        component: FreeComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.free.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: FreeDetailComponent,
        resolve: {
            free: FreeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.free.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: FreeUpdateComponent,
        resolve: {
            free: FreeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.free.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: FreeUpdateComponent,
        resolve: {
            free: FreeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.free.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const freePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: FreeDeletePopupComponent,
        resolve: {
            free: FreeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.free.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
