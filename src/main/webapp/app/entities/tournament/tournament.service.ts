import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITournament, ITournamentForm } from 'app/shared/model/tournament.model';
import { IUser } from 'app/core/user/user.model';

type EntityResponseType = HttpResponse<ITournament>;
type EntityArrayResponseType = HttpResponse<ITournament[]>;
type EntityArrayResponseTypeExtra = HttpResponse<ITournamentForm>;

@Injectable({ providedIn: 'root' })
export class TournamentService {
    public resourceUrl = SERVER_API_URL + 'api/tournaments';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/tournaments';

    constructor(protected http: HttpClient) {}

    create(tournament: ITournament): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(tournament);
        return this.http
            .post<ITournament>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(tournament: ITournament): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(tournament);
        return this.http
            .put<ITournament>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    signOn(tournament: ITournament): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(tournament);
        return this.http
            .put<ITournament>(this.resourceUrl + '/signOn', copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    close(tournament: ITournament): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(tournament);
        return this.http
            .put<ITournament>(this.resourceUrl + '/close', copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    closeTournament(tournament: ITournament, id: number): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(tournament);
        return this.http
            .put<ITournament>(this.resourceUrl + '/closeTournament', copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    closeTournamentChooseWinner(tournament: ITournament, id: number): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(tournament);
        return this.http
            .put<ITournament>(this.resourceUrl + '/closeTournamentChooseWinner/' + id, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityArrayResponseTypeExtra> {
        return this.http
            .get<ITournamentForm>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityArrayResponseTypeExtra) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITournament[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITournament[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(tournament: ITournament): ITournament {
        const copy: ITournament = Object.assign({}, tournament, {
            meetingDate: tournament.meetingDate != null && tournament.meetingDate.isValid() ? tournament.meetingDate.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.meetingDate = res.body.meetingDate != null ? moment(res.body.meetingDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((tournament: ITournament) => {
                tournament.meetingDate = tournament.meetingDate != null ? moment(tournament.meetingDate) : null;
            });
        }
        return res;
    }
}
