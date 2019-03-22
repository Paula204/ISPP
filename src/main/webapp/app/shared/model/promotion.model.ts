import { ISponsor } from 'app/shared/model/sponsor.model';

export interface IPromotion {
    id?: number;
    title?: string;
    qr?: string;
    sponsor?: ISponsor;
}

export class Promotion implements IPromotion {
    constructor(public id?: number, public title?: string, public qr?: string, public sponsor?: ISponsor) {}
}
