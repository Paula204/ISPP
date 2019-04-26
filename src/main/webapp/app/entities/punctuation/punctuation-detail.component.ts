import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPunctuation } from 'app/shared/model/punctuation.model';

@Component({
    selector: 'jhi-punctuation-detail',
    templateUrl: './punctuation-detail.component.html'
})
export class PunctuationDetailComponent implements OnInit {
    punctuation: IPunctuation;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ punctuation }) => {
            this.punctuation = punctuation;
        });
    }

    previousState() {
        window.history.back();
    }
}
