import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdministrator } from 'app/shared/model/administrator.model';

@Component({
    selector: 'jhi-administrator-detail',
    templateUrl: './administrator-detail.component.html'
})
export class AdministratorDetailComponent implements OnInit {
    administrator: IAdministrator;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ administrator }) => {
            this.administrator = administrator;
        });
    }

    previousState() {
        window.history.back();
    }
}
