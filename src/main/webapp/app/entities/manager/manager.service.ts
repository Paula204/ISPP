import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IManager } from 'app/shared/model/manager.model';

type EntityResponseType = HttpResponse<IManager>;
type EntityArrayResponseType = HttpResponse<IManager[]>;

@Injectable({ providedIn: 'root' })
export class ManagerService {
    public resourceUrl = SERVER_API_URL + 'api/managers';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/managers';

    constructor(protected http: HttpClient) {}

    create(manager: IManager): Observable<EntityResponseType> {
        return this.http.post<IManager>(this.resourceUrl, manager, { observe: 'response' });
    }

    update(manager: IManager): Observable<EntityResponseType> {
        return this.http.put<IManager>(this.resourceUrl, manager, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IManager>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IManager[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IManager[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
