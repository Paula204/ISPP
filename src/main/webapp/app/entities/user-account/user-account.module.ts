import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ThorneoSharedModule } from 'app/shared';
import {
    UserAccountComponent,
    UserAccountDetailComponent,
    UserAccountUpdateComponent,
    UserAccountDeletePopupComponent,
    UserAccountDeleteDialogComponent,
    userAccountRoute,
    userAccountPopupRoute
} from './';

const ENTITY_STATES = [...userAccountRoute, ...userAccountPopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        UserAccountComponent,
        UserAccountDetailComponent,
        UserAccountUpdateComponent,
        UserAccountDeleteDialogComponent,
        UserAccountDeletePopupComponent
    ],
    entryComponents: [UserAccountComponent, UserAccountUpdateComponent, UserAccountDeleteDialogComponent, UserAccountDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoUserAccountModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
