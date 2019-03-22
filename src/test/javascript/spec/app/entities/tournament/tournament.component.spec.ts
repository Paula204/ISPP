/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ThorneoTestModule } from '../../../test.module';
import { TournamentComponent } from 'app/entities/tournament/tournament.component';
import { TournamentService } from 'app/entities/tournament/tournament.service';
import { Tournament } from 'app/shared/model/tournament.model';

describe('Component Tests', () => {
    describe('Tournament Management Component', () => {
        let comp: TournamentComponent;
        let fixture: ComponentFixture<TournamentComponent>;
        let service: TournamentService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [TournamentComponent],
                providers: []
            })
                .overrideTemplate(TournamentComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TournamentComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TournamentService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Tournament(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.tournaments[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
