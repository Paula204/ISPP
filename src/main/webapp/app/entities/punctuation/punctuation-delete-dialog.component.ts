import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPunctuation } from 'app/shared/model/punctuation.model';
import { PunctuationService } from './punctuation.service';

@Component({
    selector: 'jhi-punctuation-delete-dialog',
    templateUrl: './punctuation-delete-dialog.component.html'
})
export class PunctuationDeleteDialogComponent {
    punctuation: IPunctuation;

    constructor(
        protected punctuationService: PunctuationService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.punctuationService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'punctuationListModification',
                content: 'Deleted an punctuation'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-punctuation-delete-popup',
    template: ''
})
export class PunctuationDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ punctuation }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PunctuationDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.punctuation = punctuation;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/punctuation', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/punctuation', { outlets: { popup: null } }]);
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
