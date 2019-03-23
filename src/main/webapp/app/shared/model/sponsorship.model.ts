import { IUser } from 'app/core/user/user.model';
import { ITournament } from 'app/shared/model/tournament.model';

export interface ISponsorship {
    id?: number;
    banner?: string;
    targetUrl?: string;
    user?: IUser;
    tournament?: ITournament;
}

export class Sponsorship implements ISponsorship {
    constructor(
        public id?: number,
        public banner?: string,
        public targetUrl?: string,
        public user?: IUser,
        public tournament?: ITournament
    ) {}
}
