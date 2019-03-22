import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IParticipant } from 'app/shared/model/participant.model';

type EntityResponseType = HttpResponse<IParticipant>;
type EntityArrayResponseType = HttpResponse<IParticipant[]>;

@Injectable({ providedIn: 'root' })
export class ParticipantService {
    public resourceUrl = SERVER_API_URL + 'api/participants';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/participants';

    constructor(protected http: HttpClient) {}

    create(participant: IParticipant): Observable<EntityResponseType> {
        return this.http.post<IParticipant>(this.resourceUrl, participant, { observe: 'response' });
    }

    update(participant: IParticipant): Observable<EntityResponseType> {
        return this.http.put<IParticipant>(this.resourceUrl, participant, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IParticipant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IParticipant[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IParticipant[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
