import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { UpgradeUserComponent } from './upgrade-user.component';

export const UPGRADE_USER_ROUTE: Routes = [
    {
        path: 'upgrade-user',
        component: UpgradeUserComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'upgrade-user.title'
        },
        canActivate: [UserRouteAccessService]
    }
];
