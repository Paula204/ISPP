/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { ClasificationUpdateComponent } from 'app/entities/clasification/clasification-update.component';
import { ClasificationService } from 'app/entities/clasification/clasification.service';
import { Clasification } from 'app/shared/model/clasification.model';

describe('Component Tests', () => {
    describe('Clasification Management Update Component', () => {
        let comp: ClasificationUpdateComponent;
        let fixture: ComponentFixture<ClasificationUpdateComponent>;
        let service: ClasificationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [ClasificationUpdateComponent]
            })
                .overrideTemplate(ClasificationUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ClasificationUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ClasificationService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Clasification(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.clasification = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Clasification();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.clasification = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
