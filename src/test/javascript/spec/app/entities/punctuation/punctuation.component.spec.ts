/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ThorneoTestModule } from '../../../test.module';
import { PunctuationComponent } from 'app/entities/punctuation/punctuation.component';
import { PunctuationService } from 'app/entities/punctuation/punctuation.service';
import { Punctuation } from 'app/shared/model/punctuation.model';

describe('Component Tests', () => {
    describe('Punctuation Management Component', () => {
        let comp: PunctuationComponent;
        let fixture: ComponentFixture<PunctuationComponent>;
        let service: PunctuationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PunctuationComponent],
                providers: []
            })
                .overrideTemplate(PunctuationComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PunctuationComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PunctuationService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Punctuation(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.punctuations[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
