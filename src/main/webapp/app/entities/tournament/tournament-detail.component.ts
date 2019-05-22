import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ITournament, ITournamentForm, Tournament } from 'app/shared/model/tournament.model';
import { TournamentService } from '.';
import { ParticipationService } from 'app/entities/participation';
import { Observable } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';
import { Account, AccountService, User } from 'app/core';
import { HasAnyAuthorityDirective } from 'app/shared';

import { forEach } from '@angular/router/src/utils/collection';
import { filter, map } from 'rxjs/operators';
import { ISponsorship, Sponsorship } from 'app/shared/model/sponsorship.model';
import { SponsorshipService } from 'app/entities/sponsorship';
import { TSObjectKeyword } from '@babel/types';
import { IParticipation, Participation } from 'app/shared/model/participation.model';
import * as os from 'os';

@Component({
    selector: 'jhi-tournament-detail',
    templateUrl: './tournament-detail.component.html'
})
export class TournamentDetailComponent implements OnInit {
    tournament: ITournamentForm;
    currentAccount: Account;
    currentDate: Date;
    abc = location.href;
    nonbotton: boolean;
    sponsorship: ISponsorship;
    isSaving: boolean;
    participa: boolean;
    estaEn: boolean;
    currentUser: any;
    winner: any;
    i: number;
    p: IParticipation;
    parti: boolean;
    x: IParticipation[];
    mayor: boolean;
    soyMayor: boolean;
    minAgeTorneo: number;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected activatedRoute: ActivatedRoute,
        protected sponsorshipService: SponsorshipService,
        protected accountService: AccountService,
        protected tournamentService: TournamentService,
        protected participationService: ParticipationService,
        private router: Router
    ) {
        this.sponsorship = {};
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ tournament }) => {
            this.tournament = tournament;
        });
        this.currentDate = new Date();
        this.sponsorshipService
            .findRandom()
            .pipe(
                filter((response: HttpResponse<Sponsorship>) => response.ok),
                map((sponsorship: HttpResponse<Sponsorship>) => sponsorship.body)
            )
            .subscribe(value => (this.sponsorship = value));
        for (this.i = 0; this.i < this.tournament.participations.length - 1; this.i++) {
            this.p = this.tournament.participations[this.i];
            if (this.p.punctuation === 10000) {
                this.winner = this.p;
                break;
            }
        }
        for (let i = 0; this.tournament.participations.length; i++) {
            if (this.tournament.participations[i].punctuation === 10000) {
                this.winner = this.tournament.participations[i];
                break;
            } else {
                this.winner = null;
            }
        }

        if (this.tournament.participations !== undefined) {
            this.x = this.tournament.participations;
        } else {
            this.x = [];
        }

        this.parti = true;
        if (this.tournament.participations.length === 0) {
            this.parti = false;
        }

        this.soyMayor = false;
        this.mayor = false;
        this.minAgeTorneo = this.tournament.game.minAge;

        if (this.tournament.game.minAge >= 18) {
            this.mayor = true;
        }
    }

    nonbottonn() {
        alert(this.estaEn);
        let participacion;
        for (participacion of this.tournament.participations) {
            if (participacion.user.login === this.currentAccount.login) {
                this.estaEn = true;
                alert(this.estaEn);
            }
        }
    }

    previousState() {
        window.history.back();
    }

    signOn() {
        this.isSaving = true;
        let participacion;
        for (participacion of this.tournament.participations) {
            if (participacion.user.login === this.currentAccount.login) {
                this.participa = true;
                this.estaEn = false;
            }
        }
        if (this.tournament.participations === null) {
            this.tournament.participations = [];
        }
        if (this.tournament.price !== 0 && this.tournament.price !== null && !this.participa) {
            if (this.currentAccount.authorities.includes('ROLE_USER')) {
                if (this.currentAccount.authorities.includes('ROLE_ADMIN')) {
                    this.subscribeToSaveResponse(this.tournamentService.signOn(this.tournament));
                } else {
                    this.router.navigate(['paypal-payments/inscribeTorneo/' + this.tournament.id]);
                }
            }
        } else {
            this.subscribeToSaveResponse(this.tournamentService.signOn(this.tournament));
        }
    }

    signOnUser() {
        this.isSaving = true;
    }

    close() {
        this.isSaving = true;

        this.subscribeToSaveResponse(this.tournamentService.close(this.tournament));
    }

    disqualify(id: number) {
        this.isSaving = true;

        this.subscribeToSaveResponse(this.participationService.disqualify(id));
    }

    win(id: number) {
        this.isSaving = true;

        this.subscribeToSaveResponse(this.participationService.win(id));
    }

    tie(id: number) {
        this.isSaving = true;

        this.subscribeToSaveResponse(this.participationService.tie(id));
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ITournament>>) {
        result.subscribe((res: HttpResponse<ITournament>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    copyAccount(account) {
        return {
            activated: account.activated,
            email: account.email,
            firstName: account.firstName,
            langKey: account.langKey,
            lastName: account.lastName,
            login: account.login,
            imageUrl: account.imageUrl
        };
    }

    setMayor() {
        if (this.soyMayor === false) {
            this.soyMayor = true;
        } else {
            this.soyMayor = false;
        }
    }
}
