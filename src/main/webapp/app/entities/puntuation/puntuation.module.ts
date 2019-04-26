import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ThorneoSharedModule } from 'app/shared';
import {
    PuntuationComponent,
    PuntuationDetailComponent,
    PuntuationUpdateComponent,
    PuntuationDeletePopupComponent,
    PuntuationDeleteDialogComponent,
    puntuationRoute,
    puntuationPopupRoute
} from './';

const ENTITY_STATES = [...puntuationRoute, ...puntuationPopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PuntuationComponent,
        PuntuationDetailComponent,
        PuntuationUpdateComponent,
        PuntuationDeleteDialogComponent,
        PuntuationDeletePopupComponent
    ],
    entryComponents: [PuntuationComponent, PuntuationUpdateComponent, PuntuationDeleteDialogComponent, PuntuationDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoPuntuationModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
