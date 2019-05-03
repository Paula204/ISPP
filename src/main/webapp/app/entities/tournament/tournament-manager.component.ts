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
    public reinicio: Array<any> = [];

    tournament: ITournamentForm;

    currentAccount: Account;
    currentDate: Date;

    isSaving: boolean;
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
            const puntuaciones0 = [];
            for (const p of this.punctuations) {
                if (p.round === 0) {
                    puntuaciones0.push(p);
                }
            }
            // Comprobamos el número de puntuaciones y lo ajustamos para que cuadre con teamsP
            if (puntuaciones0.length % 2 !== 0) {
                puntuaciones0.push(null);
            }
            if (puntuaciones0.length > 4) {
                while (puntuaciones0.length % 8 !== 0) {
                    puntuaciones0.push(null);
                }
            }

            // Rellenamos teamsP con las puntuaciones iniciales OK
            for (let y = 0; y < puntuaciones0.length - 1; y++) {
                if (y % 2 === 0) {
                    if (puntuaciones0[i] === null) {
                        teamsP.push([null, null]);
                    } else if (puntuaciones0[y + 1] === null) {
                        teamsP.push([puntuaciones0[y].participation.user.login, null]);
                    } else {
                        teamsP.push([puntuaciones0[y].participation.user.login, puntuaciones0[y + 1].participation.user.login]);
                    }
                }
            }

            // Rellenamos results con los puntos de las puntuaciones que tocan
            for (let roundTemp = 0; roundTemp <= i; roundTemp++) {
                resultsP.push([]); // Añadimos un conjunto para cada ronda
                const puntuacionesDeRoundTemp = [];
                for (const puntuacionTemp of this.punctuations) {
                    // Con el conjunto de arriba y este for, nos quedamos con las puntuaciones de cada ronda
                    if (puntuacionTemp.round === roundTemp) {
                        puntuacionesDeRoundTemp.push(puntuacionTemp); // Vamos añadiendo las puntuaciones de cada ronda
                    }
                }
                // Nos aseguramos que puntuacionesDeRoundTemp es par
                if (puntuacionesDeRoundTemp.length % 2 !== 0) {
                    puntuacionesDeRoundTemp.push(null);
                }
                // Nos recorremos las puntuaciones de cada ronda
                for (let z = 0; z < puntuacionesDeRoundTemp.length - 1; z++) {
                    if (z % 2 === 0) {
                        if (puntuacionesDeRoundTemp[z] !== null) {
                            resultsP[roundTemp].push([puntuacionesDeRoundTemp[z].points, puntuacionesDeRoundTemp[z + 1].points]);
                        }
                    }
                }
            }

            // Creamos el array a mostrar por JQuery
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
        if (this.reinicio !== null) {
            if (this.reinicio.length === 3) {
                this.hora = this.reinicio[0];
                this.minuto = this.reinicio[1];
                this.segundos = this.reinicio[2];

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
                this.reinicio = [];
            }
        }
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

    pause() {
        this.reinicio = [];
        this.reinicio[0] = this.hora;
        this.reinicio[1] = this.minuto;
        this.reinicio[2] = this.segundos;
        clearInterval(this.contador);
    }
}
