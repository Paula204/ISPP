import { IActor } from 'app/shared/model/actor.model';
import { IPromotion } from 'app/shared/model/promotion.model';
import { ITournament } from 'app/shared/model/tournament.model';

export interface ISponsor {
    id?: number;
    actor?: IActor;
    promotions?: IPromotion[];
    tournaments?: ITournament[];
}

export class Sponsor implements ISponsor {
    constructor(public id?: number, public actor?: IActor, public promotions?: IPromotion[], public tournaments?: ITournament[]) {}
}
