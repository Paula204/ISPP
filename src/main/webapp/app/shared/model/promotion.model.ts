import { IUser } from 'app/core/user/user.model';

export interface IPromotion {
    id?: number;
    title?: string;
    qr?: string;
    user?: IUser;
}

export class Promotion implements IPromotion {
    constructor(public id?: number, public title?: string, public qr?: string, public user?: IUser) {}
}
