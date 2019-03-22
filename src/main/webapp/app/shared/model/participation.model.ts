import { IActor } from 'app/shared/model/actor.model';
import { ITournament } from 'app/shared/model/tournament.model';

export interface IParticipation {
    id?: number;
    disqualify?: boolean;
    punctuation?: number;
    actor?: IActor;
    tournament?: ITournament;
}

export class Participation implements IParticipation {
    constructor(
        public id?: number,
        public disqualify?: boolean,
        public punctuation?: number,
        public actor?: IActor,
        public tournament?: ITournament
    ) {
        this.disqualify = this.disqualify || false;
    }
}
