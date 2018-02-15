import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Terminal } from './terminal.model';
import { TerminalPopupService } from './terminal-popup.service';
import { TerminalService } from './terminal.service';

@Component({
    selector: 'jhi-terminal-delete-dialog',
    templateUrl: './terminal-delete-dialog.component.html'
})
export class TerminalDeleteDialogComponent {

    terminal: Terminal;

    constructor(
        private terminalService: TerminalService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.terminalService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'terminalListModification',
                content: 'Deleted an terminal'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-terminal-delete-popup',
    template: ''
})
export class TerminalDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private terminalPopupService: TerminalPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.terminalPopupService
                .open(TerminalDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
