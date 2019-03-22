/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ThorneoTestModule } from '../../../test.module';
import { FreeComponent } from 'app/entities/free/free.component';
import { FreeService } from 'app/entities/free/free.service';
import { Free } from 'app/shared/model/free.model';

describe('Component Tests', () => {
    describe('Free Management Component', () => {
        let comp: FreeComponent;
        let fixture: ComponentFixture<FreeComponent>;
        let service: FreeService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [FreeComponent],
                providers: []
            })
                .overrideTemplate(FreeComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(FreeComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FreeService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Free(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.frees[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
