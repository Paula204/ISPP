/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { PunctuationUpdateComponent } from 'app/entities/punctuation/punctuation-update.component';
import { PunctuationService } from 'app/entities/punctuation/punctuation.service';
import { Punctuation } from 'app/shared/model/punctuation.model';

describe('Component Tests', () => {
    describe('Punctuation Management Update Component', () => {
        let comp: PunctuationUpdateComponent;
        let fixture: ComponentFixture<PunctuationUpdateComponent>;
        let service: PunctuationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PunctuationUpdateComponent]
            })
                .overrideTemplate(PunctuationUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PunctuationUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PunctuationService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Punctuation(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.punctuation = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Punctuation();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.punctuation = entity;
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
