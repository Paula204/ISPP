import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IFree } from 'app/shared/model/free.model';

type EntityResponseType = HttpResponse<IFree>;
type EntityArrayResponseType = HttpResponse<IFree[]>;

@Injectable({ providedIn: 'root' })
export class FreeService {
    public resourceUrl = SERVER_API_URL + 'api/frees';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/frees';

    constructor(protected http: HttpClient) {}

    create(free: IFree): Observable<EntityResponseType> {
        return this.http.post<IFree>(this.resourceUrl, free, { observe: 'response' });
    }

    update(free: IFree): Observable<EntityResponseType> {
        return this.http.put<IFree>(this.resourceUrl, free, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IFree>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IFree[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IFree[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
