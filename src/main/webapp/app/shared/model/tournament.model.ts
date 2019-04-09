import { Moment } from 'moment';
import { IParticipation } from 'app/shared/model/participation.model';
import { IUser } from 'app/core/user/user.model';
import { IGame } from 'app/shared/model/game.model';

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
    imagenContentType?: string;
    imagen?: any;
    participations?: IParticipation[];
    user?: IUser;
    game?: IGame;
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
        public imagenContentType?: string,
        public imagen?: any,
        public participations?: IParticipation[],
        public user?: IUser,
        public game?: IGame
    ) {}
}
