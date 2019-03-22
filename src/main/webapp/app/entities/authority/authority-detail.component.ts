import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAuthority } from 'app/shared/model/authority.model';

@Component({
    selector: 'jhi-authority-detail',
    templateUrl: './authority-detail.component.html'
})
export class AuthorityDetailComponent implements OnInit {
    authority: IAuthority;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ authority }) => {
            this.authority = authority;
        });
    }

    previousState() {
        window.history.back();
    }
}
