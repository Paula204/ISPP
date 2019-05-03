/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { PunctuationDetailComponent } from 'app/entities/punctuation/punctuation-detail.component';
import { Punctuation } from 'app/shared/model/punctuation.model';

describe('Component Tests', () => {
    describe('Punctuation Management Detail Component', () => {
        let comp: PunctuationDetailComponent;
        let fixture: ComponentFixture<PunctuationDetailComponent>;
        const route = ({ data: of({ punctuation: new Punctuation(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PunctuationDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PunctuationDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PunctuationDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.punctuation).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
