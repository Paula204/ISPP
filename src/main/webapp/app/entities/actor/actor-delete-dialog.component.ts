import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IActor } from 'app/shared/model/actor.model';
import { ActorService } from './actor.service';

@Component({
    selector: 'jhi-actor-delete-dialog',
    templateUrl: './actor-delete-dialog.component.html'
})
export class ActorDeleteDialogComponent {
    actor: IActor;

    constructor(protected actorService: ActorService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.actorService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'actorListModification',
                content: 'Deleted an actor'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-actor-delete-popup',
    template: ''
})
export class ActorDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ actor }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ActorDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.actor = actor;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/actor', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/actor', { outlets: { popup: null } }]);
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
