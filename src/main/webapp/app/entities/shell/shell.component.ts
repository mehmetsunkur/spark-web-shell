import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Shell } from './shell.model';
import { ShellService } from './shell.service';
import { Principal } from '../../shared';

import {TerminalService} from 'primeng/components/terminal/terminalservice';
import { WindowRef } from '../../shared/tracker/window.service';
import { AuthServerProvider } from '../../shared/auth/auth-jwt.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'jhi-shell',
    templateUrl: './shell.component.html',
    providers: [TerminalService]
})
export class ShellComponent implements OnInit, OnDestroy {
shells: Shell[];
    currentAccount: any;
    eventSubscriber: Subscription;
    ws: WebSocket;

    constructor(
        private shellService: ShellService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private terminalService: TerminalService,
        private $window: WindowRef,
        private authServerProvider: AuthServerProvider,
    ) {
        
        
    }

    initWs() {
        console.log("trying to subscribe to ws");
        // building absolute path so that websocket doesn't fail when deploying with a context path
        const loc = this.$window.nativeWindow.location;
        let url;
        url = 'ws://' + loc.host + loc.pathname + 'websocket/shell';
        const authToken = this.authServerProvider.getToken();
        if (authToken) {
            url += '?access_token=' + authToken;
        }
        this.ws = new WebSocket(url);
        this.ws.onopen = function() {
            console.log("shell ws opened");
            //this.send("Hello");
        };
        
        this.GetInstanceStatus().subscribe((result) => {
            this.terminalService.sendResponse(result);
          });
    }

    public GetInstanceStatus(): Observable<any>{
        
        return Observable.create(observer=>{
            this.ws.onmessage = (evt) => { 
                observer.next(evt.data);
            };
        });
        
      }

    loadAll() {
        this.shellService.query().subscribe(
            (res: HttpResponse<Shell[]>) => {
                this.shells = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        
        this.terminalService.commandHandler.subscribe(command => {
            if(command === 'connect'){
                this.terminalService.sendResponse("Connecting...");
                this.initWs();
            }else{
                //let response = (command === 'date') ? new Date().toDateString() : 'Unknown command: ' + command;
                this.ws.send(command);
                //this.terminalService.sendResponse(response);
            }
            
        });
        
        

        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInShells();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Shell) {
        return item.id;
    }
    registerChangeInShells() {
        this.eventSubscriber = this.eventManager.subscribe('shellListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
