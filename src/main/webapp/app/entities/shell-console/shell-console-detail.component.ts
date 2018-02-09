import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ShellConsole } from './shell-console.model';
import { ShellConsoleService } from './shell-console.service';

@Component({
    selector: 'jhi-shell-console-detail',
    templateUrl: './shell-console-detail.component.html'
})
export class ShellConsoleDetailComponent implements OnInit, OnDestroy {

    shellConsole: ShellConsole;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private shellConsoleService: ShellConsoleService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInShellConsoles();
    }

    load(id) {
        this.shellConsoleService.find(id)
            .subscribe((shellConsoleResponse: HttpResponse<ShellConsole>) => {
                this.shellConsole = shellConsoleResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInShellConsoles() {
        this.eventSubscriber = this.eventManager.subscribe(
            'shellConsoleListModification',
            (response) => this.load(this.shellConsole.id)
        );
    }
}
