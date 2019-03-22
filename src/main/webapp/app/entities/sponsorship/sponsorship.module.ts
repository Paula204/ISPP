import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ThorneoSharedModule } from 'app/shared';
import {
    SponsorshipComponent,
    SponsorshipDetailComponent,
    SponsorshipUpdateComponent,
    SponsorshipDeletePopupComponent,
    SponsorshipDeleteDialogComponent,
    sponsorshipRoute,
    sponsorshipPopupRoute
} from './';

const ENTITY_STATES = [...sponsorshipRoute, ...sponsorshipPopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        SponsorshipComponent,
        SponsorshipDetailComponent,
        SponsorshipUpdateComponent,
        SponsorshipDeleteDialogComponent,
        SponsorshipDeletePopupComponent
    ],
    entryComponents: [SponsorshipComponent, SponsorshipUpdateComponent, SponsorshipDeleteDialogComponent, SponsorshipDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoSponsorshipModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
