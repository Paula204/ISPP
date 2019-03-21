import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IGame } from 'app/shared/model/game.model';

type EntityResponseType = HttpResponse<IGame>;
type EntityArrayResponseType = HttpResponse<IGame[]>;

@Injectable({ providedIn: 'root' })
export class GameService {
    public resourceUrl = SERVER_API_URL + 'api/games';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/games';

    constructor(protected http: HttpClient) {}

    create(game: IGame): Observable<EntityResponseType> {
        return this.http.post<IGame>(this.resourceUrl, game, { observe: 'response' });
    }

    update(game: IGame): Observable<EntityResponseType> {
        return this.http.put<IGame>(this.resourceUrl, game, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IGame>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IGame[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IGame[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
