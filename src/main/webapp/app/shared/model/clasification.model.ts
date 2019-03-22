import { IParticipant } from 'app/shared/model/participant.model';

export interface IClasification {
    id?: number;
    punctuation?: number;
    participant?: IParticipant;
}

export class Clasification implements IClasification {
    constructor(public id?: number, public punctuation?: number, public participant?: IParticipant) {}
}
