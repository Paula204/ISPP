import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ThorneoSharedModule } from 'app/shared';
import {
    PromotionComponent,
    PromotionDetailComponent,
    PromotionUpdateComponent,
    PromotionDeletePopupComponent,
    PromotionDeleteDialogComponent,
    promotionRoute,
    promotionPopupRoute
} from './';

const ENTITY_STATES = [...promotionRoute, ...promotionPopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PromotionComponent,
        PromotionDetailComponent,
        PromotionUpdateComponent,
        PromotionDeleteDialogComponent,
        PromotionDeletePopupComponent
    ],
    entryComponents: [PromotionComponent, PromotionUpdateComponent, PromotionDeleteDialogComponent, PromotionDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoPromotionModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
