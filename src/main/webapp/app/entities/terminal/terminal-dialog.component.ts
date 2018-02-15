import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Terminal } from './terminal.model';
import { TerminalPopupService } from './terminal-popup.service';
import { TerminalService } from './terminal.service';

@Component({
    selector: 'jhi-terminal-dialog',
    templateUrl: './terminal-dialog.component.html'
})
export class TerminalDialogComponent implements OnInit {

    terminal: Terminal;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private terminalService: TerminalService,
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
        if (this.terminal.id !== undefined) {
            this.subscribeToSaveResponse(
                this.terminalService.update(this.terminal));
        } else {
            this.subscribeToSaveResponse(
                this.terminalService.create(this.terminal));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Terminal>>) {
        result.subscribe((res: HttpResponse<Terminal>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Terminal) {
        this.eventManager.broadcast({ name: 'terminalListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-terminal-popup',
    template: ''
})
export class TerminalPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private terminalPopupService: TerminalPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.terminalPopupService
                    .open(TerminalDialogComponent as Component, params['id']);
            } else {
                this.terminalPopupService
                    .open(TerminalDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
