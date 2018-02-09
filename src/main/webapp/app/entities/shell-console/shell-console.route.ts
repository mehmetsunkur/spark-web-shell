import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ShellConsoleComponent } from './shell-console.component';
import { ShellConsoleDetailComponent } from './shell-console-detail.component';
import { ShellConsolePopupComponent } from './shell-console-dialog.component';
import { ShellConsoleDeletePopupComponent } from './shell-console-delete-dialog.component';

export const shellConsoleRoute: Routes = [
    {
        path: 'shell-console',
        component: ShellConsoleComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.shellConsole.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'shell-console/:id',
        component: ShellConsoleDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.shellConsole.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shellConsolePopupRoute: Routes = [
    {
        path: 'shell-console-new',
        component: ShellConsolePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.shellConsole.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shell-console/:id/edit',
        component: ShellConsolePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.shellConsole.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shell-console/:id/delete',
        component: ShellConsoleDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.shellConsole.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
