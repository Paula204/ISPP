import { IActor } from 'app/shared/model/actor.model';
import { ITournament } from 'app/shared/model/tournament.model';

export interface IFree {
    id?: number;
    actor?: IActor;
    tournaments?: ITournament[];
}

export class Free implements IFree {
    constructor(public id?: number, public actor?: IActor, public tournaments?: ITournament[]) {}
}
