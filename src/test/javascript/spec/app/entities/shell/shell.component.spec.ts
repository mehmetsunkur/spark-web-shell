/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SparkWebShellTestModule } from '../../../test.module';
import { ShellComponent } from '../../../../../../main/webapp/app/entities/shell/shell.component';
import { ShellService } from '../../../../../../main/webapp/app/entities/shell/shell.service';
import { Shell } from '../../../../../../main/webapp/app/entities/shell/shell.model';

describe('Component Tests', () => {

    describe('Shell Management Component', () => {
        let comp: ShellComponent;
        let fixture: ComponentFixture<ShellComponent>;
        let service: ShellService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SparkWebShellTestModule],
                declarations: [ShellComponent],
                providers: [
                    ShellService
                ]
            })
            .overrideTemplate(ShellComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShellComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShellService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Shell(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.shells[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
