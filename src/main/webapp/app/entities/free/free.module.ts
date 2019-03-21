import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ThorneoSharedModule } from 'app/shared';
import {
    FreeComponent,
    FreeDetailComponent,
    FreeUpdateComponent,
    FreeDeletePopupComponent,
    FreeDeleteDialogComponent,
    freeRoute,
    freePopupRoute
} from './';

const ENTITY_STATES = [...freeRoute, ...freePopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [FreeComponent, FreeDetailComponent, FreeUpdateComponent, FreeDeleteDialogComponent, FreeDeletePopupComponent],
    entryComponents: [FreeComponent, FreeUpdateComponent, FreeDeleteDialogComponent, FreeDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoFreeModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
