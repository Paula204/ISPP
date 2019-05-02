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
import { PunctuationService, PunctuationTournamentComponent } from 'app/entities/punctuation';
import { filter, map } from 'rxjs/operators';
import { Sponsorship } from 'app/shared/model/sponsorship.model';
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
    public hora: 0;
    public minuto: 0;
    public segundos: 0;
    public collection: Array<any> = [];
    public contador: any;

    tournament: ITournamentForm;

    currentAccount: Account;
    currentDate: Date;

    isSaving: boolean;
    p: IParticipation[];
    i: number;
    l: number;
    participation: Participation;
    punctuations: IPunctuation[];
    route: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService,
        protected tournamentService: TournamentService,
        protected participationService: ParticipationService,
        protected punctuationService: PunctuationService
    ) {
        const res = activatedRoute.snapshot.url.length;
        this.route = activatedRoute.snapshot.url[res - 2].toString();
        this.tournamentService.find(+this.route).subscribe(tournament => {
            this.tournament = tournament.body;
        });
    }
    ngOnDestroy() {
        window.location.reload();
    }
    ngOnInit() {
        this.hora = 0;
        this.minuto = 0;
        this.segundos = 0;
        this.activatedRoute.data.subscribe(({ tournament }) => {
            this.tournament = tournament;
        });
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.currentDate = new Date();
        this.p = this.tournament.participations;
        // ....
        // Metodo completo para JQuery. Empieza a partir de aquí:
        // Obtenemos las puntuaciones
        const teamsP = [];
        const resultsP = [];
        this.tournamentService.getAllPunctuations(+this.route).subscribe((punctuations: HttpResponse<IPunctuation[]>) => {
            this.punctuations = punctuations.body;
            // Vemos en que ronda está el torneo
            let i = 0;
            for (const punctuu of punctuations.body) {
                if (punctuu.round > i) {
                    i = punctuu.round;
                }
            }

            // Sacamos las puntuaciones de la última ronda
            const nuevasPuntuaciones = [];
            for (const necesario of punctuations.body) {
                if (necesario.round === i) {
                    nuevasPuntuaciones.push(necesario);
                }
            }
            // Ordenamos el array por su ronda y luego por índice
            /* punctuations.body.sort(function(a, b) {
                const aRound = a.round;
                const bRound = b.round;
                const aIndex = a.index;
                const bIndex = b.index;
                if (aRound === bRound) {
                    return aIndex > bIndex ? -1 : aIndex < bIndex ? 1 : 0;
                } else {
                    return aRound < bRound ? -1 : 1;
                }
            });*/

            // Creamos el array a mostrar por JQuery

            // Usuarios de la ronda
            let userRonda = [];
            let ronda = 0;
            const indexT = 0;
            // Aquí almacenaremos la ronda completa
            const rondaCompleta = [];
            while (ronda < i) {
                userRonda = [];
                // Sacamos los user de la ronda
                for (const pp of punctuations.body) {
                    if (pp.round === ronda) {
                        userRonda.push(punctuations.body[indexT]);
                    }
                }
                let indice2 = 0;
                // Los agrupampos de dos en dos y lo metemos en ronda completa
                let indice3 = 2;
                while (userRonda.length > indice3) {
                    indice3 = indice3 * 2;
                }
                while (indice2 < indice3) {
                    if (indice2 === userRonda.length - 1) {
                        if (ronda === 0) {
                            teamsP.push([punctuations.body[indice2].participation.user.login, null]);
                        }
                        rondaCompleta.push([punctuations.body[indice2].points]);
                    } else if (indice2 > userRonda.length) {
                        if (ronda === 0) {
                            teamsP.push([null, null]);
                        }
                        rondaCompleta.push([null, null]);
                    } else {
                        if (ronda === 0) {
                            teamsP.push([
                                punctuations.body[indice2].participation.user.login,
                                punctuations.body[indice2 + 1].participation.user.login
                            ]);
                        }
                        rondaCompleta.push([punctuations.body[indice2].points, punctuations.body[indice2 + 1].points]);
                    }
                    indice2 = indice2 + 2;
                }
                ronda++;
                resultsP.push(rondaCompleta);
            }

            const saveData = {
                teams: teamsP,
                results: resultsP
            };

            // Use this inside your document ready jQuery
            $(window).on('popstate', function() {
                location.reload(true);
            });
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
        });
        // ANTIGUO METODO
        /*
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
        */
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

    start() {
        if (this.contador === null || this.contador === undefined) {
            this.contador = setInterval(() => {
                this.segundos += 1;
                if (this.segundos === 60) {
                    this.minuto += 1;
                    this.segundos = 0;
                    if (this.minuto === 60) {
                        this.hora += 1;
                        this.minuto = 0;
                        if (this.hora === 24) {
                            this.hora = 0;
                        }
                    }
                }
            }, 1000);
        }
    }
    lapso() {
        //  this.horaLapso = this.hora;
        //  this.minutoLapso = this.minuto;
        //  this.segundoLapso = this.segundos;
        const obj: any = {};
        obj.hora = this.hora;
        obj.minuto = this.minuto;
        obj.segundos = this.segundos;
        this.collection.push(obj);
    }
    stop() {
        clearInterval(this.contador);
        this.hora = 0;
        this.minuto = 0;
        this.segundos = 0;
        this.contador = null;
    }
}
