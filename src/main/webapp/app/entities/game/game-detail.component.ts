import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ITournament, ITournamentForm, Tournament } from 'app/shared/model/tournament.model';
import { TournamentService } from '../tournament';
import { ParticipationService } from 'app/entities/participation';
import { Observable } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';
import { Account, AccountService, User } from 'app/core';
import { HasAnyAuthorityDirective } from 'app/shared';

import { forEach } from '@angular/router/src/utils/collection';

import { filter, map } from 'rxjs/operators';

import { IGame } from 'app/shared/model/game.model';
import { ISponsorship, Sponsorship } from 'app/shared/model/sponsorship.model';
import { SponsorshipService } from 'app/entities/sponsorship';

@Component({
    selector: 'jhi-game-detail',
    templateUrl: './game-detail.component.html'
})
export class GameDetailComponent implements OnInit {
    game: IGame;
    sponsorship: ISponsorship;
    tournament: ITournamentForm;
    currentAccount: Account;
    currentDate: Date;

    nonbotton: boolean;

    isSaving: boolean;
    participa: boolean;
    algo: any;
    currentUser: any;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected jhiAlertService: JhiAlertService,
        protected sponsorshipService: SponsorshipService,
        protected accountService: AccountService,
        protected tournamentService: TournamentService,
        protected participationService: ParticipationService,
        private router: Router
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ game }) => {
            this.game = game;
        });
        this.sponsorshipService
            .findRandom()
            .pipe(
                filter((response: HttpResponse<Sponsorship>) => response.ok),
                map((sponsorship: HttpResponse<Sponsorship>) => sponsorship.body)
            )
            .subscribe(value => (this.sponsorship = value));
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        /*
        let participacion;
        for (participacion of this.tournament.participations) {
            alert(participacion.user.login );
            if (participacion.user.login === participacion.user.login) {
                this.nonbotton = true;
            }
        }*/
        this.currentDate = new Date();
    }

    previousState() {
        window.history.back();
    }
}
