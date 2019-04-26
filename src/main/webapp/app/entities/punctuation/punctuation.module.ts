import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ThorneoSharedModule } from 'app/shared';
import {
    PunctuationComponent,
    PunctuationDetailComponent,
    PunctuationUpdateComponent,
    PunctuationDeletePopupComponent,
    PunctuationDeleteDialogComponent,
    punctuationRoute,
    punctuationPopupRoute
} from './';

const ENTITY_STATES = [...punctuationRoute, ...punctuationPopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PunctuationComponent,
        PunctuationDetailComponent,
        PunctuationUpdateComponent,
        PunctuationDeleteDialogComponent,
        PunctuationDeletePopupComponent
    ],
    entryComponents: [PunctuationComponent, PunctuationUpdateComponent, PunctuationDeleteDialogComponent, PunctuationDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoPunctuationModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
