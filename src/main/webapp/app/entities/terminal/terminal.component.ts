import { Component, OnInit, OnDestroy, Output, Input, EventEmitter, ViewChild, AfterViewInit, AfterContentInit, ElementRef} from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Terminal } from './terminal.model';
import { TerminalService } from './terminal.service';
import { Principal } from '../../shared';
import { TerminalBuffer, keyMap, ɵa } from 'ng-terminal';
import { WindowRef } from '../../shared/tracker/window.service';
import { AuthServerProvider } from '../../shared/auth/auth-jwt.service';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {MatAutocompleteModule} from '@angular/material';
export class Command {
    constructor(public command: string, public lastUsageTime: Date, public count: number) { }
  }


@Component({
    selector: 'jhi-terminal',
    templateUrl: './terminal.component.html',
    styles: [`
    .terminal-canvas{
        color: white;
        text-align: left;
    }

    .terminal-view-port{
        background-color: black;
        overflow-y: auto;
        overflow-wrap: break-word;
        width: 100%;
        height: 100%;
    }

    .typing-unit{
        font-family: monospace; 
        border-width: opx;
    }
    .command-form {
        min-width: 150px;
        //max-width: 500px;
        width: 100%;
      }
      
      .command-full-width {
        width: 100%;
      }
      
    `]
})
export class TerminalComponent implements OnInit, OnDestroy {
    

    terminals: Terminal[];
    currentAccount: any;
    eventSubscriber: Subscription;
    public bf: TerminalBuffer;
    ws: WebSocket;
    commandLine: string = '';
    @ViewChild(ɵa) terminalComponent: ɵa;
    commandCtrl: FormControl;
    filteredCommands: Observable<any[]>;
    commandHistoryNavIndex: number = 0;
    waitingResponse: boolean = false;


    commands: Command[] = [
    {
        command: ':help',
        lastUsageTime: null,
        count: 0
    },
    {
        command: ':history',
        lastUsageTime: null,
        count: 0
      },    
      {
        command: ':implicits',
        lastUsageTime: null,
        count: 0
      },
  ];

  filterStates(name: string) {
    return this.commands.filter(commandItem =>
        commandItem.command.toLowerCase().indexOf(name.toLowerCase()) >= 0);
  }
    
    constructor(
        private terminalService: TerminalService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private $window: WindowRef,
        private authServerProvider: AuthServerProvider,
    ) {
        this.commandCtrl = new FormControl(); 
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
            if(this.waitingResponse){
                this.waitingResponse = false;
            }
            
            window.scrollTo(0,document.body.scrollHeight);
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
        this.terminalComponent.viewMode = true;
        this.bf = bf;
    }
    onNext(e: Event) {
        console.log(e.toString());
    }

    onCommandKey(e: KeyboardEvent) {
        if (e.key == 'Enter') {
            this.onEnter(e);
        } else if (e.key == 'ArrowUp') {
            this.onUp(e);
        } else if (e.key == 'ArrowDown') {
            this.onDown(e);
        }
    }

    onDown(e: KeyboardEvent) {
        
        if(this.commandHistoryNavIndex>0){
            this.commandHistoryNavIndex--;
        }
        let cmd = this.commands[this.commandHistoryNavIndex];
        if(cmd){
            this.commandLine = cmd.command;    
        }
        
    }

    onUp(e: KeyboardEvent) {
        if(this.commandHistoryNavIndex<this.commands.length-1){
            this.commandHistoryNavIndex++;
        }
        let cmd = this.commands[this.commandHistoryNavIndex];
        if(cmd){
            this.commandLine = cmd.command;    
        }
        
        
    }


    onEnter(e: KeyboardEvent) {
        if(this.commandCtrl.value !=''){
            this.commandLine = this.commandCtrl.value;
            this.ws.send(this.commandLine + keyMap.Return );
            this.waitingResponse = true;
            this.bf.write(this.commandLine + keyMap.Linefeed + keyMap.Return);
            this.pushCommandToHistory(this.commandLine)
            this.commandLine = '';
            this.commandCtrl.setValue('');
        }
    }

    pushCommandToHistory(commandStr: string){
        let command = this.commands.find(cmd => cmd.command === commandStr);
        if(command){
            command.count++;
            command.lastUsageTime = new Date();
        }else{
            command = new Command(commandStr, new Date, 1);
            this.commands.push(command);
        }
        this.commands.sort((c1,c2) =>  {
            let cn1 = c1.lastUsageTime ? c1.lastUsageTime.getMilliseconds() : 0;
            let cn2 = c2.lastUsageTime ? c2.lastUsageTime.getMilliseconds() : 0;
            return (cn1 - cn2);
        });
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
