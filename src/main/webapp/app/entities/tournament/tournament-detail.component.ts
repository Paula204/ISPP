import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { ITournament } from 'app/shared/model/tournament.model';

@Component({
    selector: 'jhi-tournament-detail',
    templateUrl: './tournament-detail.component.html'
})
export class TournamentDetailComponent implements OnInit {
    tournament: ITournament;

    constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ tournament }) => {
            this.tournament = tournament;
        });
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }
}
