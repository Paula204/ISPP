import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITournament, ITournamentForm, Tournament } from 'app/shared/model/tournament.model';
import { TournamentService } from '.';
import { ParticipationService } from 'app/entities/participation';
import { Observable } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';
import { Account, AccountService } from 'app/core';
import { IParticipation, Participation } from 'app/shared/model/participation.model';
import { templateSourceUrl } from '@angular/compiler';
import { Punctuation, IPunctuation } from 'app/shared/model/punctuation.model';
import { PunctuationService } from 'app/entities/punctuation';
// import * as $ from 'jquery';
declare let $: any;

@Component({
    selector: 'jhi-tournament-manage2',
    styles: [
        'body{background-color: #fff} .card{flex-direction: unset} .jh-card{flex-direction: unset}' + ''
        // ' .card{flex-direction: unset} .jh-card{flex-direction: unset} div.finals.round.match {height:0px;top:0} @media only screen and (min-width: 660px) {.card{ display: flex; justify-content: center}}'
    ],
    templateUrl: './tournament-manager.component.html',
    encapsulation: ViewEncapsulation.None
})
export class TournamentManagerComponent implements OnInit, OnDestroy {
    tournament: ITournamentForm;

    currentAccount: Account;
    currentDate: Date;

    isSaving: boolean;
    p: IParticipation[];
    i: number;
    l: number;
    participation: Participation;
    punctuations: IPunctuation[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService,
        protected tournamentService: TournamentService,
        protected participationService: ParticipationService,
        protected punctuationService: PunctuationService
    ) {}
    ngOnDestroy() {
        window.location.reload();
    }
    ngOnInit() {
        this.activatedRoute.data.subscribe(({ tournament }) => {
            this.tournament = tournament;
        });
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.currentDate = new Date();
        this.p = this.tournament.participations;

        const teamsP = [];
        // Use this inside your document ready jQuery
        $(window).on('popstate', function() {
            location.reload(true);
        });
        if (this.p.length % 2 !== 0) {
            const participationPrueba = null;
            this.p.push(participationPrueba);
        }
        if (this.p.length > 4) {
            while (this.p.length % 8 !== 0) {
                const participationPrueba = null;
                this.p.push(participationPrueba);
            }
        }
        this.l = this.p.length;
        for (this.i = 0; this.i < this.l - 1; this.i++) {
            if (this.i % 2 === 0) {
                if (this.p[this.i] === null) {
                    teamsP.push([null, null]);
                } else if (this.p[this.i + 1] === null) {
                    teamsP.push([this.p[this.i].user.login, null]);
                } else {
                    teamsP.push([this.p[this.i].user.login, this.p[this.i + 1].user.login]);
                }
            }
        }
        const saveData = {
            teams: teamsP,
            results: []
        };
        /* Called whenever bracket is modified
         *
         * data:     changed bracket object in format given to init
         * userData: optional data given when bracket is created.
         */
        function saveFn(data, userData) {
            const json = $.toJSON(data);
            $('#saveOutput').text('POST ' + userData + ' ' + json);
            /* You probably want to do something like this
                jQuery.ajax("rest/"+userData, {contentType: 'application/json',
                                              dataType: 'json',
                                              type: 'post',
                                              data: json})
                */
        }

        $(function() {
            const container = $('.gestionador');
            container.bracket({
                init: saveData,
                userData: 'http://myapi'
            });
            /* You can also inquiry the current data */
            const data = container.bracket('data');

            $('#dataOutput').text($.toJSON(data));
        });
    }

    previousState() {
        window.history.back();
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
}
