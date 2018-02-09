/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SparkWebShellTestModule } from '../../../test.module';
import { ShellConsoleDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/shell-console/shell-console-delete-dialog.component';
import { ShellConsoleService } from '../../../../../../main/webapp/app/entities/shell-console/shell-console.service';

describe('Component Tests', () => {

    describe('ShellConsole Management Delete Component', () => {
        let comp: ShellConsoleDeleteDialogComponent;
        let fixture: ComponentFixture<ShellConsoleDeleteDialogComponent>;
        let service: ShellConsoleService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SparkWebShellTestModule],
                declarations: [ShellConsoleDeleteDialogComponent],
                providers: [
                    ShellConsoleService
                ]
            })
            .overrideTemplate(ShellConsoleDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShellConsoleDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShellConsoleService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
