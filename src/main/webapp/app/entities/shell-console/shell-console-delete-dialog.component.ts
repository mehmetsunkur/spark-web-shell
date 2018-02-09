import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ShellConsole } from './shell-console.model';
import { ShellConsolePopupService } from './shell-console-popup.service';
import { ShellConsoleService } from './shell-console.service';

@Component({
    selector: 'jhi-shell-console-delete-dialog',
    templateUrl: './shell-console-delete-dialog.component.html'
})
export class ShellConsoleDeleteDialogComponent {

    shellConsole: ShellConsole;

    constructor(
        private shellConsoleService: ShellConsoleService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.shellConsoleService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'shellConsoleListModification',
                content: 'Deleted an shellConsole'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-shell-console-delete-popup',
    template: ''
})
export class ShellConsoleDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shellConsolePopupService: ShellConsolePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.shellConsolePopupService
                .open(ShellConsoleDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
