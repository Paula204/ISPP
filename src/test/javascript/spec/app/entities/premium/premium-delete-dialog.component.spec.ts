/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ThorneoTestModule } from '../../../test.module';
import { PremiumDeleteDialogComponent } from 'app/entities/premium/premium-delete-dialog.component';
import { PremiumService } from 'app/entities/premium/premium.service';

describe('Component Tests', () => {
    describe('Premium Management Delete Component', () => {
        let comp: PremiumDeleteDialogComponent;
        let fixture: ComponentFixture<PremiumDeleteDialogComponent>;
        let service: PremiumService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PremiumDeleteDialogComponent]
            })
                .overrideTemplate(PremiumDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PremiumDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PremiumService);
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
