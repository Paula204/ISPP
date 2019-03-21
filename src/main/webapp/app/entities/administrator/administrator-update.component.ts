import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IAdministrator } from 'app/shared/model/administrator.model';
import { AdministratorService } from './administrator.service';

@Component({
    selector: 'jhi-administrator-update',
    templateUrl: './administrator-update.component.html'
})
export class AdministratorUpdateComponent implements OnInit {
    administrator: IAdministrator;
    isSaving: boolean;

    constructor(protected administratorService: AdministratorService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ administrator }) => {
            this.administrator = administrator;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.administrator.id !== undefined) {
            this.subscribeToSaveResponse(this.administratorService.update(this.administrator));
        } else {
            this.subscribeToSaveResponse(this.administratorService.create(this.administrator));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdministrator>>) {
        result.subscribe((res: HttpResponse<IAdministrator>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
