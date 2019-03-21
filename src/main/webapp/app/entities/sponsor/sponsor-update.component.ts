import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ISponsor } from 'app/shared/model/sponsor.model';
import { SponsorService } from './sponsor.service';

@Component({
    selector: 'jhi-sponsor-update',
    templateUrl: './sponsor-update.component.html'
})
export class SponsorUpdateComponent implements OnInit {
    sponsor: ISponsor;
    isSaving: boolean;

    constructor(protected sponsorService: SponsorService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ sponsor }) => {
            this.sponsor = sponsor;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.sponsor.id !== undefined) {
            this.subscribeToSaveResponse(this.sponsorService.update(this.sponsor));
        } else {
            this.subscribeToSaveResponse(this.sponsorService.create(this.sponsor));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ISponsor>>) {
        result.subscribe((res: HttpResponse<ISponsor>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
