import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { Ipromocion } from 'app/shared/model/promotion.model';

type EntityResponseType = HttpResponse<IPromotion>;
type EntityArrayResponseType = HttpResponse<IPromotion[]>;

@Injectable({ providedIn: 'root' })
export class PromotionService {
    public resourceUrl = SERVER_API_URL + 'api/promotions';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/promotions';

    constructor(protected http: HttpClient) {}

    create(promotion: IPromotion): Observable<EntityResponseType> {
        return this.http.post<IPromotion>(this.resourceUrl, promotion, { observe: 'response' });
    }

    update(promotion: IPromotion): Observable<EntityResponseType> {
        return this.http.put<IPromotion>(this.resourceUrl, promotion, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPromotion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPromotion[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPromotion[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
