import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';
import { PaypalCompletedPaymentsService } from './paypal-completed-payments.service';

@Component({
    selector: 'jhi-paypal-completed-payments-delete-dialog',
    templateUrl: './paypal-completed-payments-delete-dialog.component.html'
})
export class PaypalCompletedPaymentsDeleteDialogComponent {
    paypalCompletedPayments: IPaypalCompletedPayments;

    constructor(
        protected paypalCompletedPaymentsService: PaypalCompletedPaymentsService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.paypalCompletedPaymentsService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'paypalCompletedPaymentsListModification',
                content: 'Deleted an paypalCompletedPayments'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-paypal-completed-payments-delete-popup',
    template: ''
})
export class PaypalCompletedPaymentsDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ paypalCompletedPayments }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PaypalCompletedPaymentsDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.paypalCompletedPayments = paypalCompletedPayments;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/paypal-completed-payments', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/paypal-completed-payments', { outlets: { popup: null } }]);
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
