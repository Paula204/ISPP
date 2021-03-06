/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ThorneoTestModule } from '../../../test.module';
import { SponsorshipDeleteDialogComponent } from 'app/entities/sponsorship/sponsorship-delete-dialog.component';
import { SponsorshipService } from 'app/entities/sponsorship/sponsorship.service';

describe('Component Tests', () => {
    describe('Sponsorship Management Delete Component', () => {
        let comp: SponsorshipDeleteDialogComponent;
        let fixture: ComponentFixture<SponsorshipDeleteDialogComponent>;
        let service: SponsorshipService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [SponsorshipDeleteDialogComponent]
            })
                .overrideTemplate(SponsorshipDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(SponsorshipDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SponsorshipService);
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
