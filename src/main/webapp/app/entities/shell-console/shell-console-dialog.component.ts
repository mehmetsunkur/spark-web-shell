import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ShellConsole } from './shell-console.model';
import { ShellConsolePopupService } from './shell-console-popup.service';
import { ShellConsoleService } from './shell-console.service';

@Component({
    selector: 'jhi-shell-console-dialog',
    templateUrl: './shell-console-dialog.component.html'
})
export class ShellConsoleDialogComponent implements OnInit {

    shellConsole: ShellConsole;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private shellConsoleService: ShellConsoleService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.shellConsole.id !== undefined) {
            this.subscribeToSaveResponse(
                this.shellConsoleService.update(this.shellConsole));
        } else {
            this.subscribeToSaveResponse(
                this.shellConsoleService.create(this.shellConsole));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ShellConsole>>) {
        result.subscribe((res: HttpResponse<ShellConsole>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ShellConsole) {
        this.eventManager.broadcast({ name: 'shellConsoleListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-shell-console-popup',
    template: ''
})
export class ShellConsolePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shellConsolePopupService: ShellConsolePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.shellConsolePopupService
                    .open(ShellConsoleDialogComponent as Component, params['id']);
            } else {
                this.shellConsolePopupService
                    .open(ShellConsoleDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
