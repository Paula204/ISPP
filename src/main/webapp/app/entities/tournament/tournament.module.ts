import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';
import { QRCodeModule } from 'angularx-qrcode';

import { ThorneoSharedModule } from 'app/shared';
import {
    TournamentComponent,
    TournamentDetailComponent,
    TournamentUpdateComponent,
    TournamentDeletePopupComponent,
    TournamentDeleteDialogComponent,
    tournamentRoute,
    tournamentPopupRoute,
    TournamentManageComponent, //
    TournamentManagerComponent,
    PunctuationTournamentComponent
} from './';
import { TournamentMyComponent } from 'app/entities/tournament/tournament-my.component';
import { TournamentManageGroupComponent } from 'app/entities/tournament/tournament-manage-group.component';

const ENTITY_STATES = [...tournamentRoute, ...tournamentPopupRoute];

@NgModule({
    imports: [ThorneoSharedModule, RouterModule.forChild(ENTITY_STATES), QRCodeModule],
    declarations: [
        TournamentComponent,
        TournamentMyComponent,
        TournamentDetailComponent,
        TournamentUpdateComponent,
        TournamentDeleteDialogComponent,
        TournamentDeletePopupComponent,
        TournamentManageComponent, //
        TournamentManagerComponent,
        TournamentMyComponent,
        TournamentManageComponent,
        TournamentManageGroupComponent,
        PunctuationTournamentComponent
    ],
    entryComponents: [
        TournamentComponent,
        TournamentMyComponent,
        TournamentUpdateComponent,
        TournamentDeleteDialogComponent,
        TournamentDeletePopupComponent,
        TournamentManageComponent, //
        TournamentManagerComponent,
        TournamentManageGroupComponent, //
        TournamentMyComponent,
        TournamentManageComponent,
        TournamentManageGroupComponent,
        PunctuationTournamentComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoTournamentModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
