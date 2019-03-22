import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Clasification } from 'app/shared/model/clasification.model';
import { ClasificationService } from './clasification.service';
import { ClasificationComponent } from './clasification.component';
import { ClasificationDetailComponent } from './clasification-detail.component';
import { ClasificationUpdateComponent } from './clasification-update.component';
import { ClasificationDeletePopupComponent } from './clasification-delete-dialog.component';
import { IClasification } from 'app/shared/model/clasification.model';

@Injectable({ providedIn: 'root' })
export class ClasificationResolve implements Resolve<IClasification> {
    constructor(private service: ClasificationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IClasification> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Clasification>) => response.ok),
                map((clasification: HttpResponse<Clasification>) => clasification.body)
            );
        }
        return of(new Clasification());
    }
}

export const clasificationRoute: Routes = [
    {
        path: '',
        component: ClasificationComponent,
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.clasification.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ClasificationDetailComponent,
        resolve: {
            clasification: ClasificationResolve
        },
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.clasification.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ClasificationUpdateComponent,
        resolve: {
            clasification: ClasificationResolve
        },
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.clasification.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ClasificationUpdateComponent,
        resolve: {
            clasification: ClasificationResolve
        },
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.clasification.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const clasificationPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ClasificationDeletePopupComponent,
        resolve: {
            clasification: ClasificationResolve
        },
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.clasification.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
