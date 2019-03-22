export interface IAuthority {
    id?: number;
    free?: string;
    premium?: string;
    sponsor?: string;
}

export class Authority implements IAuthority {
    constructor(public id?: number, public free?: string, public premium?: string, public sponsor?: string) {}
}
