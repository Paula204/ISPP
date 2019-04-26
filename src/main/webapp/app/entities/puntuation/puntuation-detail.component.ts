import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPuntuation } from 'app/shared/model/puntuation.model';

@Component({
    selector: 'jhi-puntuation-detail',
    templateUrl: './puntuation-detail.component.html'
})
export class PuntuationDetailComponent implements OnInit {
    puntuation: IPuntuation;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ puntuation }) => {
            this.puntuation = puntuation;
        });
    }

    previousState() {
        window.history.back();
    }
}
