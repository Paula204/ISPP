import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ThorneoSharedModule } from 'app/shared';
import {
    AuthorityComponent,
    AuthorityDetailComponent,
    AuthorityUpdateComponent,
    AuthorityDeletePopupComponent,
    AuthorityDeleteDialogComponent,
    authorityRoute,
    authorityPopupRoute
} from './';

const ENTITY_STATES = [...authorityRoute, ...authorityPopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        AuthorityComponent,
        AuthorityDetailComponent,
        AuthorityUpdateComponent,
        AuthorityDeleteDialogComponent,
        AuthorityDeletePopupComponent
    ],
    entryComponents: [AuthorityComponent, AuthorityUpdateComponent, AuthorityDeleteDialogComponent, AuthorityDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoAuthorityModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
