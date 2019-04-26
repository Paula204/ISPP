import { ITournament } from 'app/shared/model/tournament.model';
import { IParticipation } from 'app/shared/model/participation.model';

export interface IPunctuation {
    id?: number;
    index?: number;
    points?: number;
    round?: number;
    tournament?: ITournament;
    participation?: IParticipation;
}

export class Punctuation implements IPunctuation {
    constructor(
        public id?: number,
        public index?: number,
        public points?: number,
        public round?: number,
        public tournament?: ITournament,
        public participation?: IParticipation
    ) {}
}
