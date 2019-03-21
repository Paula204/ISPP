import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISponsorship } from 'app/shared/model/sponsorship.model';
import { SponsorshipService } from './sponsorship.service';

@Component({
    selector: 'jhi-sponsorship-delete-dialog',
    templateUrl: './sponsorship-delete-dialog.component.html'
})
export class SponsorshipDeleteDialogComponent {
    sponsorship: ISponsorship;

    constructor(
        protected sponsorshipService: SponsorshipService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.sponsorshipService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'sponsorshipListModification',
                content: 'Deleted an sponsorship'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-sponsorship-delete-popup',
    template: ''
})
export class SponsorshipDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ sponsorship }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(SponsorshipDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.sponsorship = sponsorship;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/sponsorship', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/sponsorship', { outlets: { popup: null } }]);
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
