import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IFree } from 'app/shared/model/free.model';
import { FreeService } from './free.service';

@Component({
    selector: 'jhi-free-update',
    templateUrl: './free-update.component.html'
})
export class FreeUpdateComponent implements OnInit {
    free: IFree;
    isSaving: boolean;

    constructor(protected freeService: FreeService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ free }) => {
            this.free = free;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.free.id !== undefined) {
            this.subscribeToSaveResponse(this.freeService.update(this.free));
        } else {
            this.subscribeToSaveResponse(this.freeService.create(this.free));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IFree>>) {
        result.subscribe((res: HttpResponse<IFree>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
