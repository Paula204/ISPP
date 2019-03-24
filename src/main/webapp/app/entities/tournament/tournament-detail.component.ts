import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITournament } from 'app/shared/model/tournament.model';
import { TournamentService } from '.';
import { Observable } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';

@Component({
    selector: 'jhi-tournament-detail',
    templateUrl: './tournament-detail.component.html'
})
export class TournamentDetailComponent implements OnInit {
    tournament: ITournament;
    isSaving: boolean;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ tournament }) => {
            this.tournament = tournament;
        });
    }

    previousState() {
        window.history.back();
    }
}
