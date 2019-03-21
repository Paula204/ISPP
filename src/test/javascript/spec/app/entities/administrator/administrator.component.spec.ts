/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ThorneoTestModule } from '../../../test.module';
import { AdministratorComponent } from 'app/entities/administrator/administrator.component';
import { AdministratorService } from 'app/entities/administrator/administrator.service';
import { Administrator } from 'app/shared/model/administrator.model';

describe('Component Tests', () => {
    describe('Administrator Management Component', () => {
        let comp: AdministratorComponent;
        let fixture: ComponentFixture<AdministratorComponent>;
        let service: AdministratorService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [AdministratorComponent],
                providers: []
            })
                .overrideTemplate(AdministratorComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AdministratorComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AdministratorService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Administrator(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.administrators[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
