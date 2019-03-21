import { ITournament } from 'app/shared/model/tournament.model';

export interface IGame {
    id?: number;
    title?: string;
    tournaments?: ITournament[];
}

export class Game implements IGame {
    constructor(public id?: number, public title?: string, public tournaments?: ITournament[]) {}
}
