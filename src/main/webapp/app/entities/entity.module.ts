import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'premium',
                loadChildren: './premium/premium.module#ThorneoPremiumModule'
            },
            {
                path: 'free',
                loadChildren: './free/free.module#ThorneoFreeModule'
            },
            {
                path: 'administrator',
                loadChildren: './administrator/administrator.module#ThorneoAdministratorModule'
            },
            {
                path: 'sponsor',
                loadChildren: './sponsor/sponsor.module#ThorneoSponsorModule'
            },
            {
                path: 'tournament',
                loadChildren: './tournament/tournament.module#ThorneoTournamentModule'
            },
            {
                path: 'game',
                loadChildren: './game/game.module#ThorneoGameModule'
            },
            {
                path: 'participant',
                loadChildren: './participant/participant.module#ThorneoParticipantModule'
            },
            {
                path: 'clasification',
                loadChildren: './clasification/clasification.module#ThorneoClasificationModule'
            },
            {
                path: 'sponsorship',
                loadChildren: './sponsorship/sponsorship.module#ThorneoSponsorshipModule'
            },
            {
                path: 'promotion',
                loadChildren: './promotion/promotion.module#ThorneoPromotionModule'
            },
            {
                path: 'manager',
                loadChildren: './manager/manager.module#ThorneoManagerModule'
            },
            {
                path: 'user-account',
                loadChildren: './user-account/user-account.module#ThorneoUserAccountModule'
            },
            {
                path: 'authority',
                loadChildren: './authority/authority.module#ThorneoAuthorityModule'
            },
            {
                path: 'actor',
                loadChildren: './actor/actor.module#ThorneoActorModule'
            },
            {
                path: 'premium',
                loadChildren: './premium/premium.module#ThorneoPremiumModule'
            },
            {
                path: 'free',
                loadChildren: './free/free.module#ThorneoFreeModule'
            },
            {
                path: 'administrator',
                loadChildren: './administrator/administrator.module#ThorneoAdministratorModule'
            },
            {
                path: 'sponsor',
                loadChildren: './sponsor/sponsor.module#ThorneoSponsorModule'
            },
            {
                path: 'tournament',
                loadChildren: './tournament/tournament.module#ThorneoTournamentModule'
            },
            {
                path: 'game',
                loadChildren: './game/game.module#ThorneoGameModule'
            },
            {
                path: 'participant',
                loadChildren: './participant/participant.module#ThorneoParticipantModule'
            },
            {
                path: 'sponsorship',
                loadChildren: './sponsorship/sponsorship.module#ThorneoSponsorshipModule'
            },
            {
                path: 'promotion',
                loadChildren: './promotion/promotion.module#ThorneoPromotionModule'
            },
            {
                path: 'user-account',
                loadChildren: './user-account/user-account.module#ThorneoUserAccountModule'
            },
            {
                path: 'authority',
                loadChildren: './authority/authority.module#ThorneoAuthorityModule'
            },
            {
                path: 'actor',
                loadChildren: './actor/actor.module#ThorneoActorModule'
            },
            {
                path: 'premium',
                loadChildren: './premium/premium.module#ThorneoPremiumModule'
            },
            {
                path: 'free',
                loadChildren: './free/free.module#ThorneoFreeModule'
            },
            {
                path: 'sponsor',
                loadChildren: './sponsor/sponsor.module#ThorneoSponsorModule'
            },
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
