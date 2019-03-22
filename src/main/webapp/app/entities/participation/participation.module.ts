import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ThorneoSharedModule } from 'app/shared';
import {
    ParticipationComponent,
    ParticipationDetailComponent,
    ParticipationUpdateComponent,
    ParticipationDeletePopupComponent,
    ParticipationDeleteDialogComponent,
    participationRoute,
    participationPopupRoute
} from './';

const ENTITY_STATES = [...participationRoute, ...participationPopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ParticipationComponent,
        ParticipationDetailComponent,
        ParticipationUpdateComponent,
        ParticipationDeleteDialogComponent,
        ParticipationDeletePopupComponent
    ],
    entryComponents: [
        ParticipationComponent,
        ParticipationUpdateComponent,
        ParticipationDeleteDialogComponent,
        ParticipationDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoParticipationModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
