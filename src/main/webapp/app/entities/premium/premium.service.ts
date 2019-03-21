import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPremium } from 'app/shared/model/premium.model';

type EntityResponseType = HttpResponse<IPremium>;
type EntityArrayResponseType = HttpResponse<IPremium[]>;

@Injectable({ providedIn: 'root' })
export class PremiumService {
    public resourceUrl = SERVER_API_URL + 'api/premiums';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/premiums';

    constructor(protected http: HttpClient) {}

    create(premium: IPremium): Observable<EntityResponseType> {
        return this.http.post<IPremium>(this.resourceUrl, premium, { observe: 'response' });
    }

    update(premium: IPremium): Observable<EntityResponseType> {
        return this.http.put<IPremium>(this.resourceUrl, premium, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPremium>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPremium[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPremium[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
