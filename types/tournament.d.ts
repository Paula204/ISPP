export = tournament;
declare class tournament {
    static NONE: number;
    static compareMatches(g1: any, g2: any): any;
    static compareRes(r1: any, r2: any): any;
    static compareZip(z1: any, z2: any): any;
    static configure(Klass: any, obj: any, Initial_: any): void;
    static defaults(np: any, opts: any): any;
    static from(Klass: any, inst: any, numPlayers: any, opts: any): any;
    static inherit(Klass: any, Initial_: any): void;
    static invalid(): any;
    static isInteger(n: any): any;
    static matchTieCompute(zipSlice: any, startIdx: any, cb: any): void;
    static resTieCompute(resAry: any, startPos: any, cb: any, metric: any): void;
    static resultEntry(resAry: any, seed: any): any;
    static sorted(m: any): any;
    static sub(name: any, init: any, Initial_: any): any;
    constructor(np: any, ms: any);
    matches: any;
    state: any;
    currentRound(section: any): any;
    findMatch(id: any): any;
    findMatches(id: any): any;
    findMatchesRanged(lb: any, ub: any): any;
    isDone(): any;
    isPlayable(m: any): any;
    matchesFor(playerId: any): any;
    metadata(): any;
    nextRound(section: any): any;
    players(id: any): any;
    results(): any;
    resultsFor(seed: any): any;
    rounds(section: any): any;
    score(id: any, score: any): any;
    sections(round: any): any;
    unscorable(id: any, score: any, allowPast: any): any;
    upcoming(playerId: any): any;
}
declare namespace tournament {
    namespace helpers {
        const NONE: number;
        function findMatch(ms: any, id: any): any;
        function findMatches(ms: any, id: any): any;
        function findMatchesRanged(ms: any, lb: any, ub: any): any;
        function matchesForPlayer(ms: any, playerId: any): any;
        function metadata(ms: any): any;
        function partitionMatches(ms: any, splitKey: any, filterKey: any, filterVal: any): any;
        function playable(m: any): any;
        function players(ms: any): any;
        function rounds(ms: any): any;
        function started(ms: any): any;
        function upcoming(ms: any, playerId: any): any;
    }
}
