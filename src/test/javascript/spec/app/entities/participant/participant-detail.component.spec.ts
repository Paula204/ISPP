/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { ParticipantDetailComponent } from 'app/entities/participant/participant-detail.component';
import { Participant } from 'app/shared/model/participant.model';

describe('Component Tests', () => {
    describe('Participant Management Detail Component', () => {
        let comp: ParticipantDetailComponent;
        let fixture: ComponentFixture<ParticipantDetailComponent>;
        const route = ({ data: of({ participant: new Participant(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [ParticipantDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ParticipantDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ParticipantDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.participant).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
