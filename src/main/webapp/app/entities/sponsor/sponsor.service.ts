import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ISponsor } from 'app/shared/model/sponsor.model';

type EntityResponseType = HttpResponse<ISponsor>;
type EntityArrayResponseType = HttpResponse<ISponsor[]>;

@Injectable({ providedIn: 'root' })
export class SponsorService {
    public resourceUrl = SERVER_API_URL + 'api/sponsors';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/sponsors';

    constructor(protected http: HttpClient) {}

    create(sponsor: ISponsor): Observable<EntityResponseType> {
        return this.http.post<ISponsor>(this.resourceUrl, sponsor, { observe: 'response' });
    }

    update(sponsor: ISponsor): Observable<EntityResponseType> {
        return this.http.put<ISponsor>(this.resourceUrl, sponsor, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ISponsor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ISponsor[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ISponsor[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
