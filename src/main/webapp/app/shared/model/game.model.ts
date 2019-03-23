export const enum Category {
    CARD = 'CARD',
    MINIATURES = 'MINIATURES',
    BOARD = 'BOARD',
    DICE = 'DICE',
    ROL = 'ROL'
}

export interface IGame {
    id?: number;
    title?: string;
    description?: string;
    category?: Category;
    minAge?: number;
}

export class Game implements IGame {
    constructor(
        public id?: number,
        public title?: string,
        public description?: string,
        public category?: Category,
        public minAge?: number
    ) {}
}
