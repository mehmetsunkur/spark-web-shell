import { Component, OnInit, OnDestroy, Output, Input, EventEmitter, ViewChild, AfterViewInit, AfterContentInit} from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Terminal } from './terminal.model';
import { TerminalService } from './terminal.service';
import { Principal } from '../../shared';
import { TerminalBuffer, keyMap, ɵa } from 'ng-terminal';
import { WindowRef } from '../../shared/tracker/window.service';
import { AuthServerProvider } from '../../shared/auth/auth-jwt.service';
import { Observable } from 'rxjs/Observable';



@Component({
    selector: 'jhi-terminal',
    templateUrl: './terminal.component.html',
    styles: [`
    :host ::ng-deep .terminal-view-port{
        //max-height: 500px;
    }
    `]
})
export class TerminalComponent implements OnInit, OnDestroy, AfterContentInit {
    

    terminals: Terminal[];
    currentAccount: any;
    eventSubscriber: Subscription;
    public bf: TerminalBuffer;
    ws: WebSocket;
    commandLine: String = '';
    @ViewChild(ɵa) terminalComponent: ɵa;
    
    constructor(
        private terminalService: TerminalService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
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
            this.bf.write(result);
            //window.scrollTo(0,document.body.scrollHeight);
          });
    }

    public GetInstanceStatus(): Observable<any>{
        return Observable.create(observer=>{
            this.ws.onmessage = (evt) => { 
                observer.next(evt.data);
            };
        });
      }

    onInit(bf: TerminalBuffer) {
        this.bf = bf;
        this.bf.setAnsiEscapeMode(true);
    }
    onNext(e: Event) {
        console.log(e.toString());
    }
    onKeyUpCommandInput(e: KeyboardEvent) {
        var x = e.which || e.keyCode;
        //this.ws.send(':help' + keyMap.Linefeed);
        //this.bf.write(e.key);
        console.log("event.type " + e.type + ":" + e.key);
        if (e.key == 'Enter') {
            this.ws.send(this.commandLine + keyMap.Return );
            this.bf.write(this.commandLine + keyMap.Linefeed + keyMap.Return);
            this.commandLine = '';
            //this.terminalComponent.scrollDown();
        }
        
    }
    
    onKey(e: KeyboardEvent) {
        var x = e.which || e.keyCode;
        //this.ws.send(':help' + keyMap.Linefeed);
        //this.bf.write(e.key);
        console.log("event.type " + e.type + ":" + e.key);
        
        
        
        if (e.key == 'Enter') {
            //this.bf.write(keyMap.Linefeed);
            this.ws.send(this.commandLine + keyMap.Return );
            this.bf.write(keyMap.Linefeed + keyMap.Return);
            this.commandLine = '';
        } else if (e.key == 'Backspace') {
            this.bf.write(keyMap.BackSpace);
        } else if (e.key == 'ArrowLeft') {
            this.bf.write(keyMap.ArrowLeft);
        } else if (e.key == 'ArrowRight') {
            this.bf.write(keyMap.ArrowRight);
        } else if (e.key == 'ArrowUp') {
            //this.bf.write(keyMap.ArrowUp);
        } else if (e.key == 'ArrowDown') {
            //this.bf.write(keyMap.ArrowDown);
        } else if (e.key == 'Delete') {
            this.bf.write(keyMap.Delete);
        } else if (e.key == 'Home') {
            //this.bf.write(keyMap.KeyHome);
        } else if (e.key == 'End') {
            this.bf.write(keyMap.KeyEnd);
        } else if (e.key == 'Tab') {
            this.bf.write(keyMap.Tab);
        } else if (e.key == 'Insert') {
            this.bf.write(keyMap.Insert);
        } else if (e.type == 'compositionstart') {
            this.bf.write(' ');
        } else if (e.type == 'compositionupdate' && e.key.length == 1) {
            if (this.bf.isInsertMode()) {
                this.bf.write('\b');
                this.bf.write(e.key);
            } else {
                this.bf.write(keyMap.ArrowLeft);
                this.bf.write(e.key);
            }
        } else if (e.type == 'compositionend' && e.key.length == 1) {
            if (e.key < '\u007f') { //ignore writing low unicode key in mobile. It should be written in textInput event
                if (this.bf.isInsertMode())
                    this.bf.write('\b');
                else
                    this.bf.write(keyMap.ArrowLeft);
            } else if (this.bf.isInsertMode()) {
                this.bf.write('\b');
                this.bf.write(e.key);
            } else {
                this.bf.write(keyMap.ArrowLeft);
                this.bf.write(e.key);
            }
        } else
            if (e.key.length == 1){
                this.bf.write(e.key + '');
                this.commandLine += e.key + ''; //String.fromCharCode(e.keyCode);
            }
                
    }  

    loadAll() {
        this.terminalService.query().subscribe(
            (res: HttpResponse<Terminal[]>) => {
                this.terminals = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.initWs();
        
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInTerminals();
    }

    ngAfterContentInit(): void {
        this.terminalComponent.terminalViewPort.nativeElement.
        this.ws.send("init");
    }
    
    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Terminal) {
        return item.id;
    }
    registerChangeInTerminals() {
        this.eventSubscriber = this.eventManager.subscribe('terminalListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
