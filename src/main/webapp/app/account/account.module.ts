import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ThorneoSharedModule } from 'app/shared';

import {
    PasswordStrengthBarComponent,
    RegisterComponent,
    ActivateComponent,
    PasswordComponent,
    PasswordResetInitComponent,
    PasswordResetFinishComponent,
    SettingsComponent,
    SettingsDeleteDialogComponent,
    accountState
} from './';
import { AccountService } from 'app/core';

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(accountState)],
    declarations: [
        ActivateComponent,
        RegisterComponent,
        PasswordComponent,
        PasswordStrengthBarComponent,
        PasswordResetInitComponent,
        PasswordResetFinishComponent,
        SettingsComponent,
        SettingsDeleteDialogComponent
    ],
    entryComponents: [SettingsDeleteDialogComponent],
    providers: [AccountService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoAccountModule {}
