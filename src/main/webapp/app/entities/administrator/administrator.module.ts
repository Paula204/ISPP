import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ThorneoSharedModule } from 'app/shared';
import {
    AdministratorComponent,
    AdministratorDetailComponent,
    AdministratorUpdateComponent,
    AdministratorDeletePopupComponent,
    AdministratorDeleteDialogComponent,
    administratorRoute,
    administratorPopupRoute
} from './';

const ENTITY_STATES = [...administratorRoute, ...administratorPopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        AdministratorComponent,
        AdministratorDetailComponent,
        AdministratorUpdateComponent,
        AdministratorDeleteDialogComponent,
        AdministratorDeletePopupComponent
    ],
    entryComponents: [
        AdministratorComponent,
        AdministratorUpdateComponent,
        AdministratorDeleteDialogComponent,
        AdministratorDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoAdministratorModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
