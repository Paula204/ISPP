import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IAdministrator } from 'app/shared/model/administrator.model';

type EntityResponseType = HttpResponse<IAdministrator>;
type EntityArrayResponseType = HttpResponse<IAdministrator[]>;

@Injectable({ providedIn: 'root' })
export class AdministratorService {
    public resourceUrl = SERVER_API_URL + 'api/administrators';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/administrators';

    constructor(protected http: HttpClient) {}

    create(administrator: IAdministrator): Observable<EntityResponseType> {
        return this.http.post<IAdministrator>(this.resourceUrl, administrator, { observe: 'response' });
    }

    update(administrator: IAdministrator): Observable<EntityResponseType> {
        return this.http.put<IAdministrator>(this.resourceUrl, administrator, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IAdministrator>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IAdministrator[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IAdministrator[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
