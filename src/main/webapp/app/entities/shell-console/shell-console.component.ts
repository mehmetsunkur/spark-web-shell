import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ShellConsole } from './shell-console.model';
import { ShellConsoleService } from './shell-console.service';
import { Principal } from '../../shared';

import {TerminalService} from 'primeng/components/terminal/terminalservice';



@Component({
    selector: 'jhi-shell-console',
    templateUrl: './shell-console.component.html',
    providers: [TerminalService]
})
export class ShellConsoleComponent implements OnInit, OnDestroy {
shellConsoles: ShellConsole[];
    currentAccount: any;
    eventSubscriber: Subscription;

    subscription: Subscription;
    
    constructor(
        private shellConsoleService: ShellConsoleService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private terminalService: TerminalService
    ) {
        this.terminalService.commandHandler.subscribe(command => {
            let response = (command === 'date') ? new Date().toDateString() : 'Unknown command: ' + command;
            this.terminalService.sendResponse(response);
        });
    }

    loadAll() {
        this.shellConsoleService.query().subscribe(
            (res: HttpResponse<ShellConsole[]>) => {
                this.shellConsoles = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInShellConsoles();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    trackId(index: number, item: ShellConsole) {
        return item.id;
    }
    registerChangeInShellConsoles() {
        this.eventSubscriber = this.eventManager.subscribe('shellConsoleListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
