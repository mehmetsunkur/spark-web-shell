import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Terminal } from './terminal.model';
import { TerminalService } from './terminal.service';

@Component({
    selector: 'jhi-terminal-detail',
    templateUrl: './terminal-detail.component.html'
})
export class TerminalDetailComponent implements OnInit, OnDestroy {

    terminal: Terminal;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private terminalService: TerminalService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTerminals();
    }

    load(id) {
        this.terminalService.find(id)
            .subscribe((terminalResponse: HttpResponse<Terminal>) => {
                this.terminal = terminalResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTerminals() {
        this.eventSubscriber = this.eventManager.subscribe(
            'terminalListModification',
            (response) => this.load(this.terminal.id)
        );
    }
}
