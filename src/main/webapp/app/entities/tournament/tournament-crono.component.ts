import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Sponsorship } from 'app/shared/model/sponsorship.model';
import { JhiAlertService } from 'ng-jhipster';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ITournament } from 'app/shared/model/tournament.model';
@Component({
    selector: 'jhi-tournament-crono',
    templateUrl: './tournament-manager.component.html'
})
export class TournamentCronoComponent implements OnInit {
    public hora: number = 0;
    public minuto: number = 0;
    public segundos: number = 0;
    isSaving: boolean;
    // public horaLapso: number = 0;
    // public minutoLapso: number = 0;
    // public segundoLapso: number = 0;
    public collection: Array<any> = [];
    public contador: any;
    constructor(protected jhiAlertService: JhiAlertService, protected activatedRoute: ActivatedRoute, private router: Router) {}
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
        let obj: any = {};
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

    ngOnInit() {}
    previousState() {
        window.history.back();
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
