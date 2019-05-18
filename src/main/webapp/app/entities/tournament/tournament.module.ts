import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';
import { QRCodeModule } from 'angularx-qrcode';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';

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
import { TweetComponent } from 'app/entities/tournament/Tweet.component';
import { FbLikeComponent } from 'app/entities/tournament/facebook.component';

import { AgmCoreModule, GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GMapsService } from 'app/entities/tournament/tournament.service';

const ENTITY_STATES = [...tournamentRoute, ...tournamentPopupRoute];

@NgModule({
    imports: [
        ThorneoSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        QRCodeModule,
        JwSocialButtonsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDFxPztSfXaUNv1WgazDCUcbhqJMorFuWY'
        }),
        CommonModule,
        FormsModule
    ],
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
        PunctuationTournamentComponent,
        TweetComponent,
        FbLikeComponent
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

    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }, TournamentComponent, GMapsService],
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
