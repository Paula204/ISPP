/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ThorneoTestModule } from '../../../test.module';
import { ClasificationComponent } from 'app/entities/clasification/clasification.component';
import { ClasificationService } from 'app/entities/clasification/clasification.service';
import { Clasification } from 'app/shared/model/clasification.model';

describe('Component Tests', () => {
    describe('Clasification Management Component', () => {
        let comp: ClasificationComponent;
        let fixture: ComponentFixture<ClasificationComponent>;
        let service: ClasificationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [ClasificationComponent],
                providers: []
            })
                .overrideTemplate(ClasificationComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ClasificationComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ClasificationService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Clasification(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.clasifications[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
