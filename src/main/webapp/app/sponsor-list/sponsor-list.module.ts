import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ThorneoSharedModule } from '../shared';

import { SPONSOR_LIST_ROUTE, SponsorListComponent } from './';
import { CommonModule } from '@angular/common';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

@NgModule({
    declarations: [SponsorListComponent],
    imports: [ThorneoSharedModule, CommonModule, RouterModule.forChild(SPONSOR_LIST_ROUTE)],
    entryComponents: [SponsorListComponent],
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
