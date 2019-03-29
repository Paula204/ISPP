/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ThorneoTestModule } from '../../../test.module';
import { TournamentDeleteDialogComponent } from 'app/entities/tournament/tournament-delete-dialog.component';
import { TournamentService } from 'app/entities/tournament/tournament.service';

describe('Component Tests', () => {
    describe('Tournament Management Delete Component', () => {
        let comp: TournamentDeleteDialogComponent;
        let fixture: ComponentFixture<TournamentDeleteDialogComponent>;
        let service: TournamentService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [TournamentDeleteDialogComponent]
            })
                .overrideTemplate(TournamentDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TournamentDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TournamentService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
