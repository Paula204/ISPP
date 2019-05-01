/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { TournamentDetailComponent } from 'app/entities/tournament/tournament-detail.component';
import { Tournament } from 'app/shared/model/tournament.model';

describe('Component Tests', () => {
    describe('Tournament Management Detail Component', () => {
        let comp: TournamentDetailComponent;
        let fixture: ComponentFixture<TournamentDetailComponent>;
        const route = ({ data: of({ tournament: new Tournament(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [TournamentDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(TournamentDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TournamentDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.tournament).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
