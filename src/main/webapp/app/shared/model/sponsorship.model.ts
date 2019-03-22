import { ISponsor } from 'app/shared/model/sponsor.model';
import { ITournament } from 'app/shared/model/tournament.model';

export interface ISponsorship {
    id?: number;
    banner?: string;
    targetUrl?: string;
    sponsor?: ISponsor;
    tournament?: ITournament;
}

export class Sponsorship implements ISponsorship {
    constructor(
        public id?: number,
        public banner?: string,
        public targetUrl?: string,
        public sponsor?: ISponsor,
        public tournament?: ITournament
    ) {}
}
