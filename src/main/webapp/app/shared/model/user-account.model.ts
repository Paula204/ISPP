import { IAuthority } from 'app/shared/model/authority.model';

export interface IUserAccount {
    id?: number;
    userName?: string;
    password?: string;
    banned?: boolean;
    authority?: IAuthority;
}

export class UserAccount implements IUserAccount {
    constructor(
        public id?: number,
        public userName?: string,
        public password?: string,
        public banned?: boolean,
        public authority?: IAuthority
    ) {
        this.banned = this.banned || false;
    }
}
