import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Terminal } from './terminal.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Terminal>;

@Injectable()
export class TerminalService {

    private resourceUrl =  SERVER_API_URL + 'api/terminals';

    constructor(private http: HttpClient) { }

    create(terminal: Terminal): Observable<EntityResponseType> {
        const copy = this.convert(terminal);
        return this.http.post<Terminal>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(terminal: Terminal): Observable<EntityResponseType> {
        const copy = this.convert(terminal);
        return this.http.put<Terminal>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Terminal>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Terminal[]>> {
        const options = createRequestOption(req);
        return this.http.get<Terminal[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Terminal[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Terminal = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Terminal[]>): HttpResponse<Terminal[]> {
        const jsonResponse: Terminal[] = res.body;
        const body: Terminal[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Terminal.
     */
    private convertItemFromServer(terminal: Terminal): Terminal {
        const copy: Terminal = Object.assign({}, terminal);
        return copy;
    }

    /**
     * Convert a Terminal to a JSON which can be sent to the server.
     */
    private convert(terminal: Terminal): Terminal {
        const copy: Terminal = Object.assign({}, terminal);
        return copy;
    }
}
