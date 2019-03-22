/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { SponsorDetailComponent } from 'app/entities/sponsor/sponsor-detail.component';
import { Sponsor } from 'app/shared/model/sponsor.model';

describe('Component Tests', () => {
    describe('Sponsor Management Detail Component', () => {
        let comp: SponsorDetailComponent;
        let fixture: ComponentFixture<SponsorDetailComponent>;
        const route = ({ data: of({ sponsor: new Sponsor(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [SponsorDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(SponsorDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(SponsorDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.sponsor).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
