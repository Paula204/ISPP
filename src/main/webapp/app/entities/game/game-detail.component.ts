import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGame } from 'app/shared/model/game.model';

@Component({
    selector: 'jhi-game-detail',
    templateUrl: './game-detail.component.html'
})
export class GameDetailComponent implements OnInit {
    game: IGame;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ game }) => {
            this.game = game;
        });
    }

    previousState() {
        window.history.back();
    }
}
