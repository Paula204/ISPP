/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { GameUpdateComponent } from 'app/entities/game/game-update.component';
import { GameService } from 'app/entities/game/game.service';
import { Game } from 'app/shared/model/game.model';

describe('Component Tests', () => {
    describe('Game Management Update Component', () => {
        let comp: GameUpdateComponent;
        let fixture: ComponentFixture<GameUpdateComponent>;
        let service: GameService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [GameUpdateComponent]
            })
                .overrideTemplate(GameUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(GameUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GameService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Game(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.game = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Game();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.game = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
