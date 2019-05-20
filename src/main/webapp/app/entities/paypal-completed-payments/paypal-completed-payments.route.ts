import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';
import { PaypalCompletedPaymentsService } from './paypal-completed-payments.service';
import { PaypalCompletedPaymentsComponent } from './paypal-completed-payments.component';
import { PaypalCompletedPaymentsDetailComponent } from './paypal-completed-payments-detail.component';
import { PaypalCompletedPaymentsUpdateComponent } from './paypal-completed-payments-update.component';
import { PaypalCompletedPaymentsDeletePopupComponent } from './paypal-completed-payments-delete-dialog.component';
import { IPaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';

@Injectable({ providedIn: 'root' })
export class PaypalCompletedPaymentsResolve implements Resolve<IPaypalCompletedPayments> {
    constructor(private service: PaypalCompletedPaymentsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPaypalCompletedPayments> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<PaypalCompletedPayments>) => response.ok),
                map((paypalCompletedPayments: HttpResponse<PaypalCompletedPayments>) => paypalCompletedPayments.body)
            );
        }
        return of(new PaypalCompletedPayments());
    }
}

export const paypalCompletedPaymentsRoute: Routes = [
    {
        path: 'all',
        component: PaypalCompletedPaymentsComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'thorneoApp.paypalCompletedPayments.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PaypalCompletedPaymentsDetailComponent,
        resolve: {
            paypalCompletedPayments: PaypalCompletedPaymentsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.paypalCompletedPayments.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PaypalCompletedPaymentsUpdateComponent,
        resolve: {
            paypalCompletedPayments: PaypalCompletedPaymentsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.paypalCompletedPayments.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'mine',
        component: PaypalCompletedPaymentsComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.paypalCompletedPayments.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const paypalCompletedPaymentsPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PaypalCompletedPaymentsDeletePopupComponent,
        resolve: {
            paypalCompletedPayments: PaypalCompletedPaymentsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'thorneoApp.paypalCompletedPayments.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
