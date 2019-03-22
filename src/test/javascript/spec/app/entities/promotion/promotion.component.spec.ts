/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ThorneoTestModule } from '../../../test.module';
import { PromotionComponent } from 'app/entities/promotion/promotion.component';
import { PromotionService } from 'app/entities/promotion/promotion.service';
import { Promotion } from 'app/shared/model/promotion.model';

describe('Component Tests', () => {
    describe('Promotion Management Component', () => {
        let comp: PromotionComponent;
        let fixture: ComponentFixture<PromotionComponent>;
        let service: PromotionService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PromotionComponent],
                providers: []
            })
                .overrideTemplate(PromotionComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PromotionComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PromotionService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Promotion(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.promotions[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
