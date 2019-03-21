import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClasification } from 'app/shared/model/clasification.model';

@Component({
    selector: 'jhi-clasification-detail',
    templateUrl: './clasification-detail.component.html'
})
export class ClasificationDetailComponent implements OnInit {
    clasification: IClasification;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ clasification }) => {
            this.clasification = clasification;
        });
    }

    previousState() {
        window.history.back();
    }
}
