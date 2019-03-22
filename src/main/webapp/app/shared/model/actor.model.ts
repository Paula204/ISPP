import { IUserAccount } from 'app/shared/model/user-account.model';
import { IParticipation } from 'app/shared/model/participation.model';

export interface IActor {
    id?: number;
    name?: string;
    surname?: string;
    photo?: string;
    email?: string;
    phone?: string;
    userAccount?: IUserAccount;
    participations?: IParticipation[];
}

export class Actor implements IActor {
    constructor(
        public id?: number,
        public name?: string,
        public surname?: string,
        public photo?: string,
        public email?: string,
        public phone?: string,
        public userAccount?: IUserAccount,
        public participations?: IParticipation[]
    ) {}
}
