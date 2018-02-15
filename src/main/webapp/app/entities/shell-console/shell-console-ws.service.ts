import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs/Rx';

import { CSRFService } from '../../shared/auth/csrf.service';
import { AuthServerProvider } from '../../shared/auth/auth-jwt.service';

import * as SockJS from 'sockjs-client';
import * as Stomp from 'webstomp-client';

import { JhiTrackerService } from '../../shared/tracker/tracker.service';
import { WindowRef } from '../../shared/tracker/window.service';

@Injectable()
export class ShellConsoleWebSocketService extends JhiTrackerService {
    

    constructor(
        router: Router,
        authServerProvider: AuthServerProvider,
        $window: WindowRef,
        // tslint:disable-next-line: no-unused-variable
        csrfService: CSRFService
    ) {
        super(router, authServerProvider, $window, csrfService);
    }

    connect() {
        if (this.connectedPromise === null) {
          this.connection = this.createConnection();
        }
        // building absolute path so that websocket doesn't fail when deploying with a context path
        const loc = this.$window.nativeWindow.location;
        let url;
        url = '//' + loc.host + loc.pathname + 'websocket/shell-console';
        const authToken = this.authServerProvider.getToken();
        if (authToken) {
            url += '?access_token=' + authToken;
        }
        const socket = new SockJS(url);
        this.stompClient = Stomp.over(socket);
        const headers = {};
        this.stompClient.connect(headers, () => {
            this.connectedPromise('success');
            this.connectedPromise = null;
            console.log("Shell Socket connected");
            this.subscribe();
        });
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
            this.stompClient = null;
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        this.alreadyConnectedOnce = false;
    }

    receive() {
        return this.listener;
    }

    sendCommand(msg: string) {
        if (this.stompClient !== null && this.stompClient.connected) {
            this.stompClient.send(
                '/topic/shell-console-activity', // destination
                JSON.stringify({'command': msg}), // body
                {} // header
            );
        }
    }

    subscribe() {
        this.connection.then(() => {
            this.subscriber = this.stompClient.subscribe('/topic/shell-console-tracker', (data) => {
                this.listenerObserver.next(JSON.parse(data.body));
            });
        });
    }

    unsubscribe() {
        if (this.subscriber !== null) {
            this.subscriber.unsubscribe();
        }
        this.listener = this.createListener();
    }

}

