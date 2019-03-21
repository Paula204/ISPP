/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ThorneoTestModule } from '../../../test.module';
import { PremiumComponent } from 'app/entities/premium/premium.component';
import { PremiumService } from 'app/entities/premium/premium.service';
import { Premium } from 'app/shared/model/premium.model';

describe('Component Tests', () => {
    describe('Premium Management Component', () => {
        let comp: PremiumComponent;
        let fixture: ComponentFixture<PremiumComponent>;
        let service: PremiumService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PremiumComponent],
                providers: []
            })
                .overrideTemplate(PremiumComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PremiumComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PremiumService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Premium(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.premiums[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
