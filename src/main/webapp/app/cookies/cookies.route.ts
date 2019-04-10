import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { CookiesComponent } from './cookies.component';

export const COOKIES_ROUTE: Routes = [
    {
        path: 'cookies',
        component: CookiesComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'cookies.title'
        },
        canActivate: [UserRouteAccessService]
    }
];
