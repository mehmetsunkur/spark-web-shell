import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Shell } from './shell.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Shell>;

@Injectable()
export class ShellService {

    private resourceUrl =  SERVER_API_URL + 'api/shells';

    constructor(private http: HttpClient) { }

    create(shell: Shell): Observable<EntityResponseType> {
        const copy = this.convert(shell);
        return this.http.post<Shell>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(shell: Shell): Observable<EntityResponseType> {
        const copy = this.convert(shell);
        return this.http.put<Shell>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Shell>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Shell[]>> {
        const options = createRequestOption(req);
        return this.http.get<Shell[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Shell[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Shell = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Shell[]>): HttpResponse<Shell[]> {
        const jsonResponse: Shell[] = res.body;
        const body: Shell[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Shell.
     */
    private convertItemFromServer(shell: Shell): Shell {
        const copy: Shell = Object.assign({}, shell);
        return copy;
    }

    /**
     * Convert a Shell to a JSON which can be sent to the server.
     */
    private convert(shell: Shell): Shell {
        const copy: Shell = Object.assign({}, shell);
        return copy;
    }
}
