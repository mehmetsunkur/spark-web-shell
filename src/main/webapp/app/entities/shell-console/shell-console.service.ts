import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { ShellConsole } from './shell-console.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ShellConsole>;

@Injectable()
export class ShellConsoleService {

    private resourceUrl =  SERVER_API_URL + 'api/shell-consoles';

    constructor(private http: HttpClient) { }

    create(shellConsole: ShellConsole): Observable<EntityResponseType> {
        const copy = this.convert(shellConsole);
        return this.http.post<ShellConsole>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(shellConsole: ShellConsole): Observable<EntityResponseType> {
        const copy = this.convert(shellConsole);
        return this.http.put<ShellConsole>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ShellConsole>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ShellConsole[]>> {
        const options = createRequestOption(req);
        return this.http.get<ShellConsole[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ShellConsole[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ShellConsole = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ShellConsole[]>): HttpResponse<ShellConsole[]> {
        const jsonResponse: ShellConsole[] = res.body;
        const body: ShellConsole[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ShellConsole.
     */
    private convertItemFromServer(shellConsole: ShellConsole): ShellConsole {
        const copy: ShellConsole = Object.assign({}, shellConsole);
        return copy;
    }

    /**
     * Convert a ShellConsole to a JSON which can be sent to the server.
     */
    private convert(shellConsole: ShellConsole): ShellConsole {
        const copy: ShellConsole = Object.assign({}, shellConsole);
        return copy;
    }
}
