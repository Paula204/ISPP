import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Promotion } from 'app/shared/model/promotion.model';
import { PromotionService } from './promotion.service';
import { PromotionComponent } from './promotion.component';
import { PromotionDetailComponent } from './promotion-detail.component';
import { PromotionUpdateComponent } from './promotion-update.component';
import { PromotionDeletePopupComponent } from './promotion-delete-dialog.component';
import { IPromotion } from 'app/shared/model/promotion.model';

@Injectable({ providedIn: 'root' })
export class PromotionResolve implements Resolve<IPromotion> {
    constructor(private service: PromotionService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPromotion> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Promotion>) => response.ok),
                map((promotion: HttpResponse<Promotion>) => promotion.body)
            );
        }
        return of(new Promotion());
    }
}

export const promotionRoute: Routes = [
    {
        path: '',
        component: PromotionComponent,
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.promotion.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PromotionDetailComponent,
        resolve: {
            promotion: PromotionResolve
        },
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.promotion.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PromotionUpdateComponent,
        resolve: {
            promotion: PromotionResolve
        },
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.promotion.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PromotionUpdateComponent,
        resolve: {
            promotion: PromotionResolve
        },
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.promotion.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const promotionPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PromotionDeletePopupComponent,
        resolve: {
            promotion: PromotionResolve
        },
        data: {
            authorities: ['ROLE_FREE'],
            pageTitle: 'thorneoApp.promotion.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
