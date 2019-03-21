import { IParticipant } from 'app/shared/model/participant.model';
import { IManager } from 'app/shared/model/manager.model';
import { IPromotion } from 'app/shared/model/promotion.model';

export interface ISponsor {
    id?: number;
    participants?: IParticipant[];
    managers?: IManager[];
    promotions?: IPromotion[];
}

export class Sponsor implements ISponsor {
    constructor(public id?: number, public participants?: IParticipant[], public managers?: IManager[], public promotions?: IPromotion[]) {}
}
