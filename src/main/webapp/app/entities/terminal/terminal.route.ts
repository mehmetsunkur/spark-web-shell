import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { TerminalComponent } from './terminal.component';
import { TerminalDetailComponent } from './terminal-detail.component';
import { TerminalPopupComponent } from './terminal-dialog.component';
import { TerminalDeletePopupComponent } from './terminal-delete-dialog.component';

export const terminalRoute: Routes = [
    {
        path: 'terminal',
        component: TerminalComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.terminal.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'terminal/:id',
        component: TerminalDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.terminal.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const terminalPopupRoute: Routes = [
    {
        path: 'terminal-new',
        component: TerminalPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.terminal.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'terminal/:id/edit',
        component: TerminalPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.terminal.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'terminal/:id/delete',
        component: TerminalDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.terminal.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
