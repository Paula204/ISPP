import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IManager } from 'app/shared/model/manager.model';
import { ManagerService } from './manager.service';

@Component({
    selector: 'jhi-manager-delete-dialog',
    templateUrl: './manager-delete-dialog.component.html'
})
export class ManagerDeleteDialogComponent {
    manager: IManager;

    constructor(protected managerService: ManagerService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.managerService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'managerListModification',
                content: 'Deleted an manager'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-manager-delete-popup',
    template: ''
})
export class ManagerDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ manager }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ManagerDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.manager = manager;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/manager', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/manager', { outlets: { popup: null } }]);
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
