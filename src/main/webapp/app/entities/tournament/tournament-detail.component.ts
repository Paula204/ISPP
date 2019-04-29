import { Component, OnInit } from '@angular/core';
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

    nonbotton: boolean;
    sponsorship: ISponsorship;
    isSaving: boolean;
    participa: boolean;
    estaEn: boolean;
    currentUser: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected activatedRoute: ActivatedRoute,
        protected sponsorshipService: SponsorshipService,
        protected accountService: AccountService,
        protected tournamentService: TournamentService,
        protected participationService: ParticipationService,
        private router: Router
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ tournament }) => {
            this.tournament = tournament;
        });
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });

        this.currentDate = new Date();
        this.sponsorshipService
            .findRandom()
            .pipe(
                filter((response: HttpResponse<Sponsorship>) => response.ok),
                map((sponsorship: HttpResponse<Sponsorship>) => sponsorship.body)
            )
            .subscribe(value => (this.sponsorship = value));
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
}
