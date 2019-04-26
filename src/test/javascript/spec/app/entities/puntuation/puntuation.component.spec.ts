/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ThorneoTestModule } from '../../../test.module';
import { PuntuationComponent } from 'app/entities/puntuation/puntuation.component';
import { PuntuationService } from 'app/entities/puntuation/puntuation.service';
import { Puntuation } from 'app/shared/model/puntuation.model';

describe('Component Tests', () => {
    describe('Puntuation Management Component', () => {
        let comp: PuntuationComponent;
        let fixture: ComponentFixture<PuntuationComponent>;
        let service: PuntuationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PuntuationComponent],
                providers: []
            })
                .overrideTemplate(PuntuationComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PuntuationComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PuntuationService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Puntuation(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.puntuations[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
