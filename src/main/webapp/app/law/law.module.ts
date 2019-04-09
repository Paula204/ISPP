import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ThorneoSharedModule } from '../shared';

import { LAW_ROUTE, LawComponent } from './';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [LawComponent],
    imports: [ThorneoSharedModule, CommonModule, RouterModule.forRoot(LAW_ROUTE, { useHash: true })],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoAppLawModule {}
