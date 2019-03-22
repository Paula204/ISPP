/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { PremiumDetailComponent } from 'app/entities/premium/premium-detail.component';
import { Premium } from 'app/shared/model/premium.model';

describe('Component Tests', () => {
    describe('Premium Management Detail Component', () => {
        let comp: PremiumDetailComponent;
        let fixture: ComponentFixture<PremiumDetailComponent>;
        const route = ({ data: of({ premium: new Premium(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PremiumDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PremiumDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PremiumDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.premium).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
