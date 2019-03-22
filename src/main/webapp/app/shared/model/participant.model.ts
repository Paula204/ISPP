import { IClasification } from 'app/shared/model/clasification.model';
import { IFree } from 'app/shared/model/free.model';
import { IPremium } from 'app/shared/model/premium.model';
import { ISponsor } from 'app/shared/model/sponsor.model';

export interface IParticipant {
    id?: number;
    disqualify?: boolean;
    rank?: number;
    clasification?: IClasification;
    free?: IFree;
    premium?: IPremium;
    sponsor?: ISponsor;
}

export class Participant implements IParticipant {
    constructor(
        public id?: number,
        public disqualify?: boolean,
        public rank?: number,
        public clasification?: IClasification,
        public free?: IFree,
        public premium?: IPremium,
        public sponsor?: ISponsor
    ) {
        this.disqualify = this.disqualify || false;
    }
}
