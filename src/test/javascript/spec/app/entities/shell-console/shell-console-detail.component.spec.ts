/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SparkWebShellTestModule } from '../../../test.module';
import { ShellConsoleDetailComponent } from '../../../../../../main/webapp/app/entities/shell-console/shell-console-detail.component';
import { ShellConsoleService } from '../../../../../../main/webapp/app/entities/shell-console/shell-console.service';
import { ShellConsole } from '../../../../../../main/webapp/app/entities/shell-console/shell-console.model';

describe('Component Tests', () => {

    describe('ShellConsole Management Detail Component', () => {
        let comp: ShellConsoleDetailComponent;
        let fixture: ComponentFixture<ShellConsoleDetailComponent>;
        let service: ShellConsoleService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SparkWebShellTestModule],
                declarations: [ShellConsoleDetailComponent],
                providers: [
                    ShellConsoleService
                ]
            })
            .overrideTemplate(ShellConsoleDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShellConsoleDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShellConsoleService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new ShellConsole(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.shellConsole).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
