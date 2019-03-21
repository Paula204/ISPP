import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IManager } from 'app/shared/model/manager.model';

@Component({
    selector: 'jhi-manager-detail',
    templateUrl: './manager-detail.component.html'
})
export class ManagerDetailComponent implements OnInit {
    manager: IManager;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ manager }) => {
            this.manager = manager;
        });
    }

    previousState() {
        window.history.back();
    }
}
