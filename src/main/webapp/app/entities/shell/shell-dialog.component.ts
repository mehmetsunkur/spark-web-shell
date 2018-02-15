import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Shell } from './shell.model';
import { ShellPopupService } from './shell-popup.service';
import { ShellService } from './shell.service';

@Component({
    selector: 'jhi-shell-dialog',
    templateUrl: './shell-dialog.component.html'
})
export class ShellDialogComponent implements OnInit {

    shell: Shell;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private shellService: ShellService,
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
        if (this.shell.id !== undefined) {
            this.subscribeToSaveResponse(
                this.shellService.update(this.shell));
        } else {
            this.subscribeToSaveResponse(
                this.shellService.create(this.shell));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Shell>>) {
        result.subscribe((res: HttpResponse<Shell>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Shell) {
        this.eventManager.broadcast({ name: 'shellListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-shell-popup',
    template: ''
})
export class ShellPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shellPopupService: ShellPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.shellPopupService
                    .open(ShellDialogComponent as Component, params['id']);
            } else {
                this.shellPopupService
                    .open(ShellDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
