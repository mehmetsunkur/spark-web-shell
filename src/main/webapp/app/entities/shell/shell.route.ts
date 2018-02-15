import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ShellComponent } from './shell.component';
import { ShellDetailComponent } from './shell-detail.component';
import { ShellPopupComponent } from './shell-dialog.component';
import { ShellDeletePopupComponent } from './shell-delete-dialog.component';

export const shellRoute: Routes = [
    {
        path: 'shell',
        component: ShellComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.shell.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'shell/:id',
        component: ShellDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.shell.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shellPopupRoute: Routes = [
    {
        path: 'shell-new',
        component: ShellPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.shell.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shell/:id/edit',
        component: ShellPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.shell.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shell/:id/delete',
        component: ShellDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sparkWebShellApp.shell.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
