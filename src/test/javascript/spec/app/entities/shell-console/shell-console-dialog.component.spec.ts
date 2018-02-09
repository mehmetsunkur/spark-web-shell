/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SparkWebShellTestModule } from '../../../test.module';
import { ShellConsoleDialogComponent } from '../../../../../../main/webapp/app/entities/shell-console/shell-console-dialog.component';
import { ShellConsoleService } from '../../../../../../main/webapp/app/entities/shell-console/shell-console.service';
import { ShellConsole } from '../../../../../../main/webapp/app/entities/shell-console/shell-console.model';

describe('Component Tests', () => {

    describe('ShellConsole Management Dialog Component', () => {
        let comp: ShellConsoleDialogComponent;
        let fixture: ComponentFixture<ShellConsoleDialogComponent>;
        let service: ShellConsoleService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SparkWebShellTestModule],
                declarations: [ShellConsoleDialogComponent],
                providers: [
                    ShellConsoleService
                ]
            })
            .overrideTemplate(ShellConsoleDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShellConsoleDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShellConsoleService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ShellConsole(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.shellConsole = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'shellConsoleListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ShellConsole();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.shellConsole = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'shellConsoleListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
