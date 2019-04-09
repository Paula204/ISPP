import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThorneoSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';
import { CookiesComponent } from 'app/cookies/cookies.component';
import { COOKIES_ROUTE } from 'app/cookies/cookies.route';

@NgModule({
    declarations: [CookiesComponent],
    imports: [ThorneoSharedModule, CommonModule, RouterModule.forRoot(COOKIES_ROUTE, { useHash: true })],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CookiesModule {}
