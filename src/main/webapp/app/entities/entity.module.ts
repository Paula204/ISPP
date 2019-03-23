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
                path: 'promotion',
                loadChildren: './promotion/promotion.module#ThorneoPromotionModule'
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
