import { IParticipant } from 'app/shared/model/participant.model';
import { IManager } from 'app/shared/model/manager.model';

export interface IPremium {
    id?: number;
    participants?: IParticipant[];
    managers?: IManager[];
}

export class Premium implements IPremium {
    constructor(public id?: number, public participants?: IParticipant[], public managers?: IManager[]) {}
}
