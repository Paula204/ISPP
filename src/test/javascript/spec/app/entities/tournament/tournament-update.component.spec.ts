/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { TournamentUpdateComponent } from 'app/entities/tournament/tournament-update.component';
import { TournamentService } from 'app/entities/tournament/tournament.service';
import { Tournament } from 'app/shared/model/tournament.model';

describe('Component Tests', () => {
    describe('Tournament Management Update Component', () => {
        let comp: TournamentUpdateComponent;
        let fixture: ComponentFixture<TournamentUpdateComponent>;
        let service: TournamentService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [TournamentUpdateComponent]
            })
                .overrideTemplate(TournamentUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TournamentUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TournamentService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Tournament(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.tournament = entity;
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
                    const entity = new Tournament();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.tournament = entity;
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
