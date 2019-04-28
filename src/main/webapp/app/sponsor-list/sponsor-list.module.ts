import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ThorneoSharedModule } from '../shared';

import { SPONSOR_LIST_ROUTE, SponsorDetailComponent, SponsorListComponent } from './';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(SPONSOR_LIST_ROUTE)],
    declarations: [SponsorListComponent, SponsorDetailComponent],
    entryComponents: [SponsorListComponent, SponsorDetailComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoAppSponsorListModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
