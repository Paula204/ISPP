/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { GameDetailComponent } from 'app/entities/game/game-detail.component';
import { Game } from 'app/shared/model/game.model';

describe('Component Tests', () => {
    describe('Game Management Detail Component', () => {
        let comp: GameDetailComponent;
        let fixture: ComponentFixture<GameDetailComponent>;
        const route = ({ data: of({ game: new Game(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [GameDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(GameDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(GameDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.game).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
