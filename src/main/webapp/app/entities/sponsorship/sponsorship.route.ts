import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Sponsorship } from 'app/shared/model/sponsorship.model';
import { SponsorshipService } from './sponsorship.service';
import { SponsorshipComponent } from './sponsorship.component';
import { SponsorshipDetailComponent } from './sponsorship-detail.component';
import { SponsorshipUpdateComponent } from './sponsorship-update.component';
import { SponsorshipDeletePopupComponent } from './sponsorship-delete-dialog.component';
import { ISponsorship } from 'app/shared/model/sponsorship.model';

@Injectable({ providedIn: 'root' })
export class SponsorshipResolve implements Resolve<ISponsorship> {
    constructor(private service: SponsorshipService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISponsorship> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Sponsorship>) => response.ok),
                map((sponsorship: HttpResponse<Sponsorship>) => sponsorship.body)
            );
        }
        return of(new Sponsorship());
    }
}

export const sponsorshipRoute: Routes = [
    {
        path: '',
        component: SponsorshipComponent,
        data: {
            authorities: ['ROLE_SPONSOR'],
            pageTitle: 'thorneoApp.sponsorship.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: SponsorshipDetailComponent,
        resolve: {
            sponsorship: SponsorshipResolve
        },
        data: {
            authorities: ['ROLE_SPONSOR'],
            pageTitle: 'thorneoApp.sponsorship.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: SponsorshipUpdateComponent,
        resolve: {
            sponsorship: SponsorshipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.sponsorship.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: SponsorshipUpdateComponent,
        resolve: {
            sponsorship: SponsorshipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.sponsorship.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const sponsorshipPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: SponsorshipDeletePopupComponent,
        resolve: {
            sponsorship: SponsorshipResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.sponsorship.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
