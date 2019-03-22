import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFree } from 'app/shared/model/free.model';

@Component({
    selector: 'jhi-free-detail',
    templateUrl: './free-detail.component.html'
})
export class FreeDetailComponent implements OnInit {
    free: IFree;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ free }) => {
            this.free = free;
        });
    }

    previousState() {
        window.history.back();
    }
}
