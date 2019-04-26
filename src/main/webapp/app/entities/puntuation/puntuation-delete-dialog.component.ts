import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPuntuation } from 'app/shared/model/puntuation.model';
import { PuntuationService } from './puntuation.service';

@Component({
    selector: 'jhi-puntuation-delete-dialog',
    templateUrl: './puntuation-delete-dialog.component.html'
})
export class PuntuationDeleteDialogComponent {
    puntuation: IPuntuation;

    constructor(
        protected puntuationService: PuntuationService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.puntuationService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'puntuationListModification',
                content: 'Deleted an puntuation'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-puntuation-delete-popup',
    template: ''
})
export class PuntuationDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ puntuation }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PuntuationDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.puntuation = puntuation;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/puntuation', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/puntuation', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
