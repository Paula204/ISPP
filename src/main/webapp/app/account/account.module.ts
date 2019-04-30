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
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoAccountModule {}
