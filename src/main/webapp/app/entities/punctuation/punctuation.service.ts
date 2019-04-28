import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPunctuation } from 'app/shared/model/punctuation.model';

type EntityResponseType = HttpResponse<IPunctuation>;
type EntityArrayResponseType = HttpResponse<IPunctuation[]>;

@Injectable({ providedIn: 'root' })
export class PunctuationService {
    public resourceUrl = SERVER_API_URL + 'api/punctuations';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/punctuations';

    constructor(protected http: HttpClient) {}

    create(punctuation: IPunctuation): Observable<EntityResponseType> {
        return this.http.post<IPunctuation>(this.resourceUrl, punctuation, { observe: 'response' });
    }

    update(punctuation: IPunctuation): Observable<EntityResponseType> {
        return this.http.put<IPunctuation>(this.resourceUrl, punctuation, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPunctuation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    getPunctuations(id: number): Observable<EntityArrayResponseType> {
        return this.http.get<IPunctuation[]>(`${this.resourceUrl}/${id}/tournament`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPunctuation[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPunctuation[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
