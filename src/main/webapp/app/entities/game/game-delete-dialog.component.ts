import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IGame } from 'app/shared/model/game.model';
import { GameService } from './game.service';

@Component({
    selector: 'jhi-game-delete-dialog',
    templateUrl: './game-delete-dialog.component.html'
})
export class GameDeleteDialogComponent {
    game: IGame;

    constructor(protected gameService: GameService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.gameService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'gameListModification',
                content: 'Deleted an game'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-game-delete-popup',
    template: ''
})
export class GameDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ game }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(GameDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.game = game;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/game', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/game', { outlets: { popup: null } }]);
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
