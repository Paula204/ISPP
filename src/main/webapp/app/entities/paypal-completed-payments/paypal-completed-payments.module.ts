import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ThorneoSharedModule } from 'app/shared';
import {
    PaypalCompletedPaymentsComponent,
    PaypalCompletedPaymentsDetailComponent,
    PaypalCompletedPaymentsUpdateComponent,
    PaypalCompletedPaymentsDeletePopupComponent,
    PaypalCompletedPaymentsDeleteDialogComponent,
    paypalCompletedPaymentsRoute,
    paypalCompletedPaymentsPopupRoute
} from './';

const ENTITY_STATES = [...paypalCompletedPaymentsRoute, ...paypalCompletedPaymentsPopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PaypalCompletedPaymentsComponent,
        PaypalCompletedPaymentsDetailComponent,
        PaypalCompletedPaymentsUpdateComponent,
        PaypalCompletedPaymentsDeleteDialogComponent,
        PaypalCompletedPaymentsDeletePopupComponent
    ],
    entryComponents: [
        PaypalCompletedPaymentsComponent,
        PaypalCompletedPaymentsUpdateComponent,
        PaypalCompletedPaymentsDeleteDialogComponent,
        PaypalCompletedPaymentsDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoPaypalCompletedPaymentsModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
