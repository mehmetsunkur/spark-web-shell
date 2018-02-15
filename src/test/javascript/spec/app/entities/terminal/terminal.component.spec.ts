/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SparkWebShellTestModule } from '../../../test.module';
import { TerminalComponent } from '../../../../../../main/webapp/app/entities/terminal/terminal.component';
import { TerminalService } from '../../../../../../main/webapp/app/entities/terminal/terminal.service';
import { Terminal } from '../../../../../../main/webapp/app/entities/terminal/terminal.model';

describe('Component Tests', () => {

    describe('Terminal Management Component', () => {
        let comp: TerminalComponent;
        let fixture: ComponentFixture<TerminalComponent>;
        let service: TerminalService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SparkWebShellTestModule],
                declarations: [TerminalComponent],
                providers: [
                    TerminalService
                ]
            })
            .overrideTemplate(TerminalComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TerminalComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TerminalService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Terminal(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.terminals[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
