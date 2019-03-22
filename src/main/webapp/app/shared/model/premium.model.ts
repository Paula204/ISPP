import { IActor } from 'app/shared/model/actor.model';
import { ITournament } from 'app/shared/model/tournament.model';

export interface IPremium {
    id?: number;
    actor?: IActor;
    tournaments?: ITournament[];
}

export class Premium implements IPremium {
    constructor(public id?: number, public actor?: IActor, public tournaments?: ITournament[]) {}
}
