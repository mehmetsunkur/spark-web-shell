import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SparkWebShellSharedModule } from '../../shared';

import { TerminalModule } from 'primeng/terminal';

import {
    ShellService,
    ShellPopupService,
    ShellComponent,
    ShellDetailComponent,
    ShellDialogComponent,
    ShellPopupComponent,
    ShellDeletePopupComponent,
    ShellDeleteDialogComponent,
    shellRoute,
    shellPopupRoute,
} from './';

const ENTITY_STATES = [
    ...shellRoute,
    ...shellPopupRoute,
];

@NgModule({
    imports: [
        SparkWebShellSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        TerminalModule
    ],
    declarations: [
        ShellComponent,
        ShellDetailComponent,
        ShellDialogComponent,
        ShellDeleteDialogComponent,
        ShellPopupComponent,
        ShellDeletePopupComponent,
    ],
    entryComponents: [
        ShellComponent,
        ShellDialogComponent,
        ShellPopupComponent,
        ShellDeleteDialogComponent,
        ShellDeletePopupComponent,
    ],
    providers: [
        ShellService,
        ShellPopupService,
        TerminalModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SparkWebShellShellModule {}
