import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SparkWebShellSharedModule } from '../../shared';

import { TerminalModule } from 'primeng/terminal';

import {
    ShellConsoleService,
    ShellConsolePopupService,
    ShellConsoleComponent,
    ShellConsoleDetailComponent,
    ShellConsoleDialogComponent,
    ShellConsolePopupComponent,
    ShellConsoleDeletePopupComponent,
    ShellConsoleDeleteDialogComponent,
    shellConsoleRoute,
    shellConsolePopupRoute,
} from './';
import { ShellConsoleWebSocketService } from './shell-console-ws.service';

const ENTITY_STATES = [
    ...shellConsoleRoute,
    ...shellConsolePopupRoute,
];

@NgModule({
    imports: [
        SparkWebShellSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        TerminalModule
    ],
    declarations: [
        ShellConsoleComponent,
        ShellConsoleDetailComponent,
        ShellConsoleDialogComponent,
        ShellConsoleDeleteDialogComponent,
        ShellConsolePopupComponent,
        ShellConsoleDeletePopupComponent,
    ],
    entryComponents: [
        ShellConsoleComponent,
        ShellConsoleDialogComponent,
        ShellConsolePopupComponent,
        ShellConsoleDeleteDialogComponent,
        ShellConsoleDeletePopupComponent,
    ],
    providers: [
        ShellConsoleService,
        ShellConsolePopupService,
        TerminalModule,
        ShellConsoleWebSocketService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SparkWebShellShellConsoleModule {}
