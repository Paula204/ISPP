import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IPremium } from 'app/shared/model/premium.model';
import { PremiumService } from './premium.service';

@Component({
    selector: 'jhi-premium-update',
    templateUrl: './premium-update.component.html'
})
export class PremiumUpdateComponent implements OnInit {
    premium: IPremium;
    isSaving: boolean;

    constructor(protected premiumService: PremiumService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ premium }) => {
            this.premium = premium;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.premium.id !== undefined) {
            this.subscribeToSaveResponse(this.premiumService.update(this.premium));
        } else {
            this.subscribeToSaveResponse(this.premiumService.create(this.premium));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPremium>>) {
        result.subscribe((res: HttpResponse<IPremium>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
