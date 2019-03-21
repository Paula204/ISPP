import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Administrator } from 'app/shared/model/administrator.model';
import { AdministratorService } from './administrator.service';
import { AdministratorComponent } from './administrator.component';
import { AdministratorDetailComponent } from './administrator-detail.component';
import { AdministratorUpdateComponent } from './administrator-update.component';
import { AdministratorDeletePopupComponent } from './administrator-delete-dialog.component';
import { IAdministrator } from 'app/shared/model/administrator.model';

@Injectable({ providedIn: 'root' })
export class AdministratorResolve implements Resolve<IAdministrator> {
    constructor(private service: AdministratorService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAdministrator> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Administrator>) => response.ok),
                map((administrator: HttpResponse<Administrator>) => administrator.body)
            );
        }
        return of(new Administrator());
    }
}

export const administratorRoute: Routes = [
    {
        path: '',
        component: AdministratorComponent,
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.administrator.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: AdministratorDetailComponent,
        resolve: {
            administrator: AdministratorResolve
        },
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.administrator.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: AdministratorUpdateComponent,
        resolve: {
            administrator: AdministratorResolve
        },
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.administrator.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: AdministratorUpdateComponent,
        resolve: {
            administrator: AdministratorResolve
        },
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.administrator.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const administratorPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: AdministratorDeletePopupComponent,
        resolve: {
            administrator: AdministratorResolve
        },
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.administrator.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
