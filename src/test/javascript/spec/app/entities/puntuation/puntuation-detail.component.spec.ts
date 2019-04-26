/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { PuntuationDetailComponent } from 'app/entities/puntuation/puntuation-detail.component';
import { Puntuation } from 'app/shared/model/puntuation.model';

describe('Component Tests', () => {
    describe('Puntuation Management Detail Component', () => {
        let comp: PuntuationDetailComponent;
        let fixture: ComponentFixture<PuntuationDetailComponent>;
        const route = ({ data: of({ puntuation: new Puntuation(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PuntuationDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PuntuationDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PuntuationDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.puntuation).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
