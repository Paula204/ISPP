export interface IAdministrator {
    id?: number;
}

export class Administrator implements IAdministrator {
    constructor(public id?: number) {}
}
