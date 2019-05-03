import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IUser } from './user.model';

type EntityArrayResponseType = HttpResponse<IUser[]>;

@Injectable({ providedIn: 'root' })
export class UserService {
    public resourceUrl = SERVER_API_URL + 'api/users';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/users';

    constructor(private http: HttpClient) {}

    create(user: IUser): Observable<HttpResponse<IUser>> {
        return this.http.post<IUser>(this.resourceUrl, user, { observe: 'response' });
    }

    update(user: IUser): Observable<HttpResponse<IUser>> {
        return this.http.put<IUser>(this.resourceUrl, user, { observe: 'response' });
    }

    find(login: string): Observable<HttpResponse<IUser>> {
        return this.http.get<IUser>(`${this.resourceUrl}/${login}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IUser[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }

    query(req?: any): Observable<HttpResponse<IUser[]>> {
        const options = createRequestOption(req);
        return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(login: string): Observable<HttpResponse<any>> {
        return this.http.delete(this.resourceUrl + '/delete/' + login, { observe: 'response' });
    }

    authorities(): Observable<string[]> {
        return this.http.get<string[]>(SERVER_API_URL + 'api/users/authorities');
    }

    sponsors(): Observable<HttpResponse<IUser[]>> {
        return this.http.get<IUser[]>(SERVER_API_URL + 'api/search/sponsors', { observe: 'response' });
    }
}
