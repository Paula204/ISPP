/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { SponsorUpdateComponent } from 'app/entities/sponsor/sponsor-update.component';
import { SponsorService } from 'app/entities/sponsor/sponsor.service';
import { Sponsor } from 'app/shared/model/sponsor.model';

describe('Component Tests', () => {
    describe('Sponsor Management Update Component', () => {
        let comp: SponsorUpdateComponent;
        let fixture: ComponentFixture<SponsorUpdateComponent>;
        let service: SponsorService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [SponsorUpdateComponent]
            })
                .overrideTemplate(SponsorUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(SponsorUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SponsorService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Sponsor(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.sponsor = entity;
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
                    const entity = new Sponsor();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.sponsor = entity;
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
