/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SparkWebShellTestModule } from '../../../test.module';
import { ShellConsoleComponent } from '../../../../../../main/webapp/app/entities/shell-console/shell-console.component';
import { ShellConsoleService } from '../../../../../../main/webapp/app/entities/shell-console/shell-console.service';
import { ShellConsole } from '../../../../../../main/webapp/app/entities/shell-console/shell-console.model';

describe('Component Tests', () => {

    describe('ShellConsole Management Component', () => {
        let comp: ShellConsoleComponent;
        let fixture: ComponentFixture<ShellConsoleComponent>;
        let service: ShellConsoleService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SparkWebShellTestModule],
                declarations: [ShellConsoleComponent],
                providers: [
                    ShellConsoleService
                ]
            })
            .overrideTemplate(ShellConsoleComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShellConsoleComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShellConsoleService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ShellConsole(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.shellConsoles[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
