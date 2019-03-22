import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ThorneoSharedModule } from 'app/shared';
import {
    PremiumComponent,
    PremiumDetailComponent,
    PremiumUpdateComponent,
    PremiumDeletePopupComponent,
    PremiumDeleteDialogComponent,
    premiumRoute,
    premiumPopupRoute
} from './';

const ENTITY_STATES = [...premiumRoute, ...premiumPopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PremiumComponent,
        PremiumDetailComponent,
        PremiumUpdateComponent,
        PremiumDeleteDialogComponent,
        PremiumDeletePopupComponent
    ],
    entryComponents: [PremiumComponent, PremiumUpdateComponent, PremiumDeleteDialogComponent, PremiumDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoPremiumModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
