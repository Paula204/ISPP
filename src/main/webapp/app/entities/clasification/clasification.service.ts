import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IClasification } from 'app/shared/model/clasification.model';

type EntityResponseType = HttpResponse<IClasification>;
type EntityArrayResponseType = HttpResponse<IClasification[]>;

@Injectable({ providedIn: 'root' })
export class ClasificationService {
    public resourceUrl = SERVER_API_URL + 'api/clasifications';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/clasifications';

    constructor(protected http: HttpClient) {}

    create(clasification: IClasification): Observable<EntityResponseType> {
        return this.http.post<IClasification>(this.resourceUrl, clasification, { observe: 'response' });
    }

    update(clasification: IClasification): Observable<EntityResponseType> {
        return this.http.put<IClasification>(this.resourceUrl, clasification, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IClasification>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IClasification[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IClasification[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
