import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ThorneoSharedModule } from '../shared';

import { PAYPAL_PAYMENTS_ROUTE, PaypalPaymentsComponent } from './';

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forRoot(PAYPAL_PAYMENTS_ROUTE, { useHash: true })],
    declarations: [PaypalPaymentsComponent],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoAppPaypalPaymentsModule {}
