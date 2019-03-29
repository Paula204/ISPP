import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITournament } from 'app/shared/model/tournament.model';
import { TournamentService } from './tournament.service';

@Component({
    selector: 'jhi-tournament-delete-dialog',
    templateUrl: './tournament-delete-dialog.component.html'
})
export class TournamentDeleteDialogComponent {
    tournament: ITournament;

    constructor(
        protected tournamentService: TournamentService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.tournamentService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'tournamentListModification',
                content: 'Deleted an tournament'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-tournament-delete-popup',
    template: ''
})
export class TournamentDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ tournament }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TournamentDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.tournament = tournament;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/tournament', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/tournament', { outlets: { popup: null } }]);
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
