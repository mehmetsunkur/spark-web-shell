import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Shell } from './shell.model';
import { ShellService } from './shell.service';

@Component({
    selector: 'jhi-shell-detail',
    templateUrl: './shell-detail.component.html'
})
export class ShellDetailComponent implements OnInit, OnDestroy {

    shell: Shell;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private shellService: ShellService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInShells();
    }

    load(id) {
        this.shellService.find(id)
            .subscribe((shellResponse: HttpResponse<Shell>) => {
                this.shell = shellResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInShells() {
        this.eventSubscriber = this.eventManager.subscribe(
            'shellListModification',
            (response) => this.load(this.shell.id)
        );
    }
}
