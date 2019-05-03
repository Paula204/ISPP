/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { TournamentDetailComponent } from 'app/entities/tournament/tournament-detail.component';
import { Tournament } from 'app/shared/model/tournament.model';
import { Participation, IParticipation } from 'app/shared/model/participation.model';
import { Game } from 'app/shared/model/game.model';

describe('Component Tests', () => {
    describe('Tournament Management Detail Component', () => {
        let comp: TournamentDetailComponent;
        let fixture: ComponentFixture<TournamentDetailComponent>;
        let participations: IParticipation[];
        participations = [];
        const route = ({
            data: of({
                game: new Game(1234, 'test', 'test', null, 6),
                tournament: new Tournament(
                    123,
                    'test',
                    'test',
                    null,
                    'test',
                    'test',
                    0,
                    2,
                    'test',
                    null,
                    0,
                    0,
                    null,
                    'test',
                    null,
                    'test',
                    participations,
                    null,
                    this.game
                )
            })
        } as any) as ActivatedRoute;

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
                // comp.ngOnInit();
                console.log('Hello');

                // THEN
                // expect(comp.tournament).toEqual(jasmine.objectContaining({ id: 123 }));
                console.log('Hello');
            });
        });
    });
});
