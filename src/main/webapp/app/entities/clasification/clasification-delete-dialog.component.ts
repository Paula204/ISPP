import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IClasification } from 'app/shared/model/clasification.model';
import { ClasificationService } from './clasification.service';

@Component({
    selector: 'jhi-clasification-delete-dialog',
    templateUrl: './clasification-delete-dialog.component.html'
})
export class ClasificationDeleteDialogComponent {
    clasification: IClasification;

    constructor(
        protected clasificationService: ClasificationService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.clasificationService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'clasificationListModification',
                content: 'Deleted an clasification'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-clasification-delete-popup',
    template: ''
})
export class ClasificationDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ clasification }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ClasificationDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.clasification = clasification;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/clasification', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/clasification', { outlets: { popup: null } }]);
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
