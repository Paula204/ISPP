import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IPaypalCompletedPayments {
    id?: number;
    date?: Moment;
    idPayment?: string;
    currency?: string;
    amount?: number;
    email?: string;
    name?: string;
    status?: string;
    user?: IUser;
}

export class PaypalCompletedPayments implements IPaypalCompletedPayments {
    constructor(
        public id?: number,
        public date?: Moment,
        public idPayment?: string,
        public currency?: string,
        public amount?: number,
        public email?: string,
        public name?: string,
        public status?: string,
        public user?: IUser
    ) {}
}
