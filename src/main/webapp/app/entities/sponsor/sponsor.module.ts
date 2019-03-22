import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ThorneoSharedModule } from 'app/shared';
import {
    SponsorComponent,
    SponsorDetailComponent,
    SponsorUpdateComponent,
    SponsorDeletePopupComponent,
    SponsorDeleteDialogComponent,
    sponsorRoute,
    sponsorPopupRoute
} from './';

const ENTITY_STATES = [...sponsorRoute, ...sponsorPopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        SponsorComponent,
        SponsorDetailComponent,
        SponsorUpdateComponent,
        SponsorDeleteDialogComponent,
        SponsorDeletePopupComponent
    ],
    entryComponents: [SponsorComponent, SponsorUpdateComponent, SponsorDeleteDialogComponent, SponsorDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoSponsorModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
