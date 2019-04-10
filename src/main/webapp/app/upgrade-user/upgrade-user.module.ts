import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradeUserComponent } from './upgrade-user.component';
import { ThorneoSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';
import { UPGRADE_USER_ROUTE } from 'app/upgrade-user/upgrade-user.route';

@NgModule({
    declarations: [UpgradeUserComponent],
    imports: [ThorneoSharedModule, CommonModule, RouterModule.forRoot(UPGRADE_USER_ROUTE, { useHash: true })],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UpgradeUserModule {}
