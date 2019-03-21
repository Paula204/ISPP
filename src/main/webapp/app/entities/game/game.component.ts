import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IGame } from 'app/shared/model/game.model';
import { AccountService } from 'app/core';
import { GameService } from './game.service';

@Component({
    selector: 'jhi-game',
    templateUrl: './game.component.html'
})
export class GameComponent implements OnInit, OnDestroy {
    games: IGame[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected gameService: GameService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.gameService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IGame[]>) => res.ok),
                    map((res: HttpResponse<IGame[]>) => res.body)
                )
                .subscribe((res: IGame[]) => (this.games = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.gameService
            .query()
            .pipe(
                filter((res: HttpResponse<IGame[]>) => res.ok),
                map((res: HttpResponse<IGame[]>) => res.body)
            )
            .subscribe(
                (res: IGame[]) => {
                    this.games = res;
                    this.currentSearch = '';
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInGames();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IGame) {
        return item.id;
    }

    registerChangeInGames() {
        this.eventSubscriber = this.eventManager.subscribe('gameListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
