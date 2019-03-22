import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IFree } from 'app/shared/model/free.model';
import { FreeService } from './free.service';

@Component({
    selector: 'jhi-free-delete-dialog',
    templateUrl: './free-delete-dialog.component.html'
})
export class FreeDeleteDialogComponent {
    free: IFree;

    constructor(protected freeService: FreeService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.freeService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'freeListModification',
                content: 'Deleted an free'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-free-delete-popup',
    template: ''
})
export class FreeDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ free }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(FreeDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.free = free;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/free', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/free', { outlets: { popup: null } }]);
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
