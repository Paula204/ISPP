/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { PuntuationUpdateComponent } from 'app/entities/puntuation/puntuation-update.component';
import { PuntuationService } from 'app/entities/puntuation/puntuation.service';
import { Puntuation } from 'app/shared/model/puntuation.model';

describe('Component Tests', () => {
    describe('Puntuation Management Update Component', () => {
        let comp: PuntuationUpdateComponent;
        let fixture: ComponentFixture<PuntuationUpdateComponent>;
        let service: PuntuationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PuntuationUpdateComponent]
            })
                .overrideTemplate(PuntuationUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PuntuationUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PuntuationService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Puntuation(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.puntuation = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Puntuation();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.puntuation = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
