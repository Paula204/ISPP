import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';

type EntityResponseType = HttpResponse<IPaypalCompletedPayments>;
type EntityArrayResponseType = HttpResponse<IPaypalCompletedPayments[]>;

@Injectable({ providedIn: 'root' })
export class PaypalCompletedPaymentsService {
    public resourceUrl = SERVER_API_URL + 'api/paypal-completed-payments';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/paypal-completed-payments';

    constructor(protected http: HttpClient) {}

    create(paypalCompletedPayments: IPaypalCompletedPayments): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(paypalCompletedPayments);
        return this.http
            .post<IPaypalCompletedPayments>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(paypalCompletedPayments: IPaypalCompletedPayments): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(paypalCompletedPayments);
        return this.http
            .put<IPaypalCompletedPayments>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IPaypalCompletedPayments>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPaypalCompletedPayments[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPaypalCompletedPayments[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(paypalCompletedPayments: IPaypalCompletedPayments): IPaypalCompletedPayments {
        const copy: IPaypalCompletedPayments = Object.assign({}, paypalCompletedPayments, {
            date:
                paypalCompletedPayments.date != null && paypalCompletedPayments.date.isValid()
                    ? paypalCompletedPayments.date.toJSON()
                    : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.date = res.body.date != null ? moment(res.body.date) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((paypalCompletedPayments: IPaypalCompletedPayments) => {
                paypalCompletedPayments.date = paypalCompletedPayments.date != null ? moment(paypalCompletedPayments.date) : null;
            });
        }
        return res;
    }
}
