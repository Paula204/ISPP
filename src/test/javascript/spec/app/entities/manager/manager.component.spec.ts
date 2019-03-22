/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ThorneoTestModule } from '../../../test.module';
import { ManagerComponent } from 'app/entities/manager/manager.component';
import { ManagerService } from 'app/entities/manager/manager.service';
import { Manager } from 'app/shared/model/manager.model';

describe('Component Tests', () => {
    describe('Manager Management Component', () => {
        let comp: ManagerComponent;
        let fixture: ComponentFixture<ManagerComponent>;
        let service: ManagerService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [ManagerComponent],
                providers: []
            })
                .overrideTemplate(ManagerComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ManagerComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ManagerService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Manager(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.managers[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
