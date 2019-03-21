/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { ParticipantUpdateComponent } from 'app/entities/participant/participant-update.component';
import { ParticipantService } from 'app/entities/participant/participant.service';
import { Participant } from 'app/shared/model/participant.model';

describe('Component Tests', () => {
    describe('Participant Management Update Component', () => {
        let comp: ParticipantUpdateComponent;
        let fixture: ComponentFixture<ParticipantUpdateComponent>;
        let service: ParticipantService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [ParticipantUpdateComponent]
            })
                .overrideTemplate(ParticipantUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ParticipantUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ParticipantService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Participant(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.participant = entity;
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
                    const entity = new Participant();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.participant = entity;
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
