import { ITournament } from 'app/shared/model/tournament.model';
import { IUser } from 'app/core/user/user.model';

export interface IParticipation {
    id?: number;
    disqualify?: boolean;
    punctuation?: number;
    tournament?: ITournament;
    user?: IUser;
}

export class Participation implements IParticipation {
    constructor(
        public id?: number,
        public disqualify?: boolean,
        public punctuation?: number,
        public tournament?: ITournament,
        public user?: IUser
    ) {
        this.disqualify = this.disqualify || false;
    }
}
