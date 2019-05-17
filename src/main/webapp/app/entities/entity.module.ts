import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'tournament',
                loadChildren: './tournament/tournament.module#ThorneoTournamentModule'
            },
            {
                path: 'my-tournament',
                loadChildren: './tournament/tournament.module#ThorneoTournamentModule'
            },
            {
                path: 'game',
                loadChildren: './game/game.module#ThorneoGameModule'
            },
            {
                path: 'participation',
                loadChildren: './participation/participation.module#ThorneoParticipationModule'
            },
            {
                path: 'sponsorship',
                loadChildren: './sponsorship/sponsorship.module#ThorneoSponsorshipModule'
            },
            {
                path: 'paypal-completed-payments',
                loadChildren: './paypal-completed-payments/paypal-completed-payments.module#ThorneoPaypalCompletedPaymentsModule'
            },
            {
                path: 'tournament',
                loadChildren: './tournament/tournament.module#ThorneoTournamentModule'
            },
            {
                path: 'tournament',
                loadChildren: './tournament/tournament.module#ThorneoTournamentModule'
            },
            {
                path: 'punctuation',
                loadChildren: './punctuation/punctuation.module#ThorneoPunctuationModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThorneoEntityModule {}
