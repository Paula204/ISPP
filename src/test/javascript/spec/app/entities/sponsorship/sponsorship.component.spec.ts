/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ThorneoTestModule } from '../../../test.module';
import { SponsorshipComponent } from 'app/entities/sponsorship/sponsorship.component';
import { SponsorshipService } from 'app/entities/sponsorship/sponsorship.service';
import { Sponsorship } from 'app/shared/model/sponsorship.model';

describe('Component Tests', () => {
    describe('Sponsorship Management Component', () => {
        let comp: SponsorshipComponent;
        let fixture: ComponentFixture<SponsorshipComponent>;
        let service: SponsorshipService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [SponsorshipComponent],
                providers: []
            })
                .overrideTemplate(SponsorshipComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(SponsorshipComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SponsorshipService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Sponsorship(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.sponsorships[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
