import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ThorneoSharedModule } from 'app/shared';
import {
    ClasificationComponent,
    ClasificationDetailComponent,
    ClasificationUpdateComponent,
    ClasificationDeletePopupComponent,
    ClasificationDeleteDialogComponent,
    clasificationRoute,
    clasificationPopupRoute
} from './';

const ENTITY_STATES = [...clasificationRoute, ...clasificationPopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ClasificationComponent,
        ClasificationDetailComponent,
        ClasificationUpdateComponent,
        ClasificationDeleteDialogComponent,
        ClasificationDeletePopupComponent
    ],
    entryComponents: [
        ClasificationComponent,
        ClasificationUpdateComponent,
        ClasificationDeleteDialogComponent,
        ClasificationDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoClasificationModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
