/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SparkWebShellTestModule } from '../../../test.module';
import { TerminalDetailComponent } from '../../../../../../main/webapp/app/entities/terminal/terminal-detail.component';
import { TerminalService } from '../../../../../../main/webapp/app/entities/terminal/terminal.service';
import { Terminal } from '../../../../../../main/webapp/app/entities/terminal/terminal.model';

describe('Component Tests', () => {

    describe('Terminal Management Detail Component', () => {
        let comp: TerminalDetailComponent;
        let fixture: ComponentFixture<TerminalDetailComponent>;
        let service: TerminalService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SparkWebShellTestModule],
                declarations: [TerminalDetailComponent],
                providers: [
                    TerminalService
                ]
            })
            .overrideTemplate(TerminalDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TerminalDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TerminalService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Terminal(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.terminal).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
