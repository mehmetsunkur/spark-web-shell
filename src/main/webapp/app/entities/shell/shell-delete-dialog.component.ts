import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Shell } from './shell.model';
import { ShellPopupService } from './shell-popup.service';
import { ShellService } from './shell.service';

@Component({
    selector: 'jhi-shell-delete-dialog',
    templateUrl: './shell-delete-dialog.component.html'
})
export class ShellDeleteDialogComponent {

    shell: Shell;

    constructor(
        private shellService: ShellService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.shellService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'shellListModification',
                content: 'Deleted an shell'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-shell-delete-popup',
    template: ''
})
export class ShellDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shellPopupService: ShellPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.shellPopupService
                .open(ShellDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
