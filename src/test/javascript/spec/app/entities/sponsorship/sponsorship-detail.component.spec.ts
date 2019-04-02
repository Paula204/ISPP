/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { SponsorshipDetailComponent } from 'app/entities/sponsorship/sponsorship-detail.component';
import { Sponsorship } from 'app/shared/model/sponsorship.model';

describe('Component Tests', () => {
    describe('Sponsorship Management Detail Component', () => {
        let comp: SponsorshipDetailComponent;
        let fixture: ComponentFixture<SponsorshipDetailComponent>;
        const route = ({ data: of({ sponsorship: new Sponsorship(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [SponsorshipDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(SponsorshipDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(SponsorshipDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.sponsorship).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
