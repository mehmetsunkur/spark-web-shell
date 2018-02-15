import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SparkWebShellSharedModule } from '../../shared';
import { NgTerminalModule } from 'ng-terminal';

import {
    TerminalService,
    TerminalPopupService,
    TerminalComponent,
    TerminalDetailComponent,
    TerminalDialogComponent,
    TerminalPopupComponent,
    TerminalDeletePopupComponent,
    TerminalDeleteDialogComponent,
    terminalRoute,
    terminalPopupRoute
} from './';

const ENTITY_STATES = [
    ...terminalRoute,
    ...terminalPopupRoute,
];

@NgModule({
    imports: [
        SparkWebShellSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        NgTerminalModule
    ],
    declarations: [
        TerminalComponent,
        TerminalDetailComponent,
        TerminalDialogComponent,
        TerminalDeleteDialogComponent,
        TerminalPopupComponent,
        TerminalDeletePopupComponent,
    ],
    entryComponents: [
        TerminalComponent,
        TerminalDialogComponent,
        TerminalPopupComponent,
        TerminalDeleteDialogComponent,
        TerminalDeletePopupComponent,
    ],
    providers: [
        TerminalService,
        TerminalPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SparkWebShellTerminalModule {}
