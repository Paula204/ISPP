import { Moment } from 'moment';
import { IGame } from 'app/shared/model/game.model';
import { IManager } from 'app/shared/model/manager.model';
import { ISponsorship } from 'app/shared/model/sponsorship.model';

export const enum Type {
    ELIMINATION = 'ELIMINATION',
    POINT = 'POINT'
}

export interface ITournament {
    id?: number;
    title?: string;
    description?: string;
    meetingDate?: Moment;
    meetingPoint?: string;
    city?: string;
    price?: number;
    playerSize?: number;
    rewards?: string;
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
    type?: Type;
    game?: IGame;
    manager?: IManager;
    sponsorships?: ISponsorship[];
}

export class Tournament implements ITournament {
    constructor(
        public id?: number,
        public title?: string,
        public description?: string,
        public meetingDate?: Moment,
        public meetingPoint?: string,
        public city?: string,
        public price?: number,
        public playerSize?: number,
        public rewards?: string,
        public imageUrl?: string,
        public latitude?: number,
        public longitude?: number,
        public type?: Type,
        public game?: IGame,
        public manager?: IManager,
        public sponsorships?: ISponsorship[]
    ) {}
}
