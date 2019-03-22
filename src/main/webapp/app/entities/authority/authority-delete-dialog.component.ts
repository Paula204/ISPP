import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAuthority } from 'app/shared/model/authority.model';
import { AuthorityService } from './authority.service';

@Component({
    selector: 'jhi-authority-delete-dialog',
    templateUrl: './authority-delete-dialog.component.html'
})
export class AuthorityDeleteDialogComponent {
    authority: IAuthority;

    constructor(
        protected authorityService: AuthorityService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.authorityService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'authorityListModification',
                content: 'Deleted an authority'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-authority-delete-popup',
    template: ''
})
export class AuthorityDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ authority }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(AuthorityDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.authority = authority;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/authority', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/authority', { outlets: { popup: null } }]);
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
