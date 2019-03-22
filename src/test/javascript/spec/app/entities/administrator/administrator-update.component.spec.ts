/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { AdministratorUpdateComponent } from 'app/entities/administrator/administrator-update.component';
import { AdministratorService } from 'app/entities/administrator/administrator.service';
import { Administrator } from 'app/shared/model/administrator.model';

describe('Component Tests', () => {
    describe('Administrator Management Update Component', () => {
        let comp: AdministratorUpdateComponent;
        let fixture: ComponentFixture<AdministratorUpdateComponent>;
        let service: AdministratorService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [AdministratorUpdateComponent]
            })
                .overrideTemplate(AdministratorUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AdministratorUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AdministratorService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Administrator(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.administrator = entity;
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
                    const entity = new Administrator();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.administrator = entity;
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
