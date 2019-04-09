import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { LawComponent } from './law.component';

export const LAW_ROUTE: Routes = [
    {
        path: 'law',
        component: LawComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'law.title'
        },
        canActivate: [UserRouteAccessService]
    }
];
