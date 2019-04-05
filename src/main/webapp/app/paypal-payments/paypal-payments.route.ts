import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { PaypalPaymentsComponent } from './paypal-payments.component';

export const PAYPAL_PAYMENTS_ROUTE: Routes = [
    {
        path: 'paypal-payments',
        component: PaypalPaymentsComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'paypal-payments.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'paypal-payments/premium',
        component: PaypalPaymentsComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'paypal-payments.premium'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'paypal-payments/sponsor',
        component: PaypalPaymentsComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'paypal-payments.premium'
        },
        canActivate: [UserRouteAccessService]
    }
];
