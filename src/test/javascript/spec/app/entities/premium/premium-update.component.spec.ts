/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { PremiumUpdateComponent } from 'app/entities/premium/premium-update.component';
import { PremiumService } from 'app/entities/premium/premium.service';
import { Premium } from 'app/shared/model/premium.model';

describe('Component Tests', () => {
    describe('Premium Management Update Component', () => {
        let comp: PremiumUpdateComponent;
        let fixture: ComponentFixture<PremiumUpdateComponent>;
        let service: PremiumService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PremiumUpdateComponent]
            })
                .overrideTemplate(PremiumUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PremiumUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PremiumService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Premium(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.premium = entity;
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
                    const entity = new Premium();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.premium = entity;
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
