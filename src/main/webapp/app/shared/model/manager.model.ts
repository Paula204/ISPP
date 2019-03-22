import { IFree } from 'app/shared/model/free.model';
import { IPremium } from 'app/shared/model/premium.model';
import { ISponsor } from 'app/shared/model/sponsor.model';
import { ITournament } from 'app/shared/model/tournament.model';

export interface IManager {
    id?: number;
    free?: IFree;
    premium?: IPremium;
    sponsor?: ISponsor;
    tournaments?: ITournament[];
}

export class Manager implements IManager {
    constructor(
        public id?: number,
        public free?: IFree,
        public premium?: IPremium,
        public sponsor?: ISponsor,
        public tournaments?: ITournament[]
    ) {}
}
