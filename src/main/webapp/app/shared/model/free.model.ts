import { IParticipant } from 'app/shared/model/participant.model';
import { IManager } from 'app/shared/model/manager.model';

export interface IFree {
    id?: number;
    participants?: IParticipant[];
    managers?: IManager[];
}

export class Free implements IFree {
    constructor(public id?: number, public participants?: IParticipant[], public managers?: IManager[]) {}
}
