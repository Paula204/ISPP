import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPromotion } from 'app/shared/model/promotion.model';
import { PromotionService } from './promotion.service';

@Component({
    selector: 'jhi-promotion-delete-dialog',
    templateUrl: './promotion-delete-dialog.component.html'
})
export class PromotionDeleteDialogComponent {
    promotion: IPromotion;

    constructor(
        protected promotionService: PromotionService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.promotionService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'promotionListModification',
                content: 'Deleted an promotion'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-promotion-delete-popup',
    template: ''
})
export class PromotionDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ promotion }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PromotionDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.promotion = promotion;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/promotion', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/promotion', { outlets: { popup: null } }]);
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
