/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { AuthorityUpdateComponent } from 'app/entities/authority/authority-update.component';
import { AuthorityService } from 'app/entities/authority/authority.service';
import { Authority } from 'app/shared/model/authority.model';

describe('Component Tests', () => {
    describe('Authority Management Update Component', () => {
        let comp: AuthorityUpdateComponent;
        let fixture: ComponentFixture<AuthorityUpdateComponent>;
        let service: AuthorityService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [AuthorityUpdateComponent]
            })
                .overrideTemplate(AuthorityUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AuthorityUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AuthorityService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Authority(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.authority = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Authority();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.authority = entity;
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
