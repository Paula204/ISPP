import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ISponsorship } from 'app/shared/model/sponsorship.model';
import { query } from '@angular/core/src/render3';

type EntityResponseType = HttpResponse<ISponsorship>;
type EntityArrayResponseType = HttpResponse<ISponsorship[]>;

@Injectable({ providedIn: 'root' })
export class SponsorshipService {
    public resourceUrl = SERVER_API_URL + 'api/sponsorships';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/sponsorships';

    constructor(protected http: HttpClient) {}

    create(sponsorship: ISponsorship): Observable<EntityResponseType> {
        return this.http.post<ISponsorship>(this.resourceUrl, sponsorship, { observe: 'response' });
    }

    update(sponsorship: ISponsorship): Observable<EntityResponseType> {
        return this.http.put<ISponsorship>(this.resourceUrl, sponsorship, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ISponsorship>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    findRandom(): Observable<EntityResponseType> {
        return this.http.get<ISponsorship>(`${this.resourceUrl}/takeOne`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ISponsorship[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ISponsorship[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
