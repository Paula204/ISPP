import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAdministrator } from 'app/shared/model/administrator.model';
import { AdministratorService } from './administrator.service';

@Component({
    selector: 'jhi-administrator-delete-dialog',
    templateUrl: './administrator-delete-dialog.component.html'
})
export class AdministratorDeleteDialogComponent {
    administrator: IAdministrator;

    constructor(
        protected administratorService: AdministratorService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.administratorService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'administratorListModification',
                content: 'Deleted an administrator'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-administrator-delete-popup',
    template: ''
})
export class AdministratorDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ administrator }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(AdministratorDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.administrator = administrator;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/administrator', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/administrator', { outlets: { popup: null } }]);
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
