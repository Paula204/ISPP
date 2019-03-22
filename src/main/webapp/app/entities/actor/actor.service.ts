import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IActor } from 'app/shared/model/actor.model';

type EntityResponseType = HttpResponse<IActor>;
type EntityArrayResponseType = HttpResponse<IActor[]>;

@Injectable({ providedIn: 'root' })
export class ActorService {
    public resourceUrl = SERVER_API_URL + 'api/actors';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/actors';

    constructor(protected http: HttpClient) {}

    create(actor: IActor): Observable<EntityResponseType> {
        return this.http.post<IActor>(this.resourceUrl, actor, { observe: 'response' });
    }

    update(actor: IActor): Observable<EntityResponseType> {
        return this.http.put<IActor>(this.resourceUrl, actor, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IActor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IActor[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IActor[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
