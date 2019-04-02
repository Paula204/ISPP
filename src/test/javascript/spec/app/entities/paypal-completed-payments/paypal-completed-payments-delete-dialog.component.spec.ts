/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ThorneoTestModule } from '../../../test.module';
import { PaypalCompletedPaymentsDeleteDialogComponent } from 'app/entities/paypal-completed-payments/paypal-completed-payments-delete-dialog.component';
import { PaypalCompletedPaymentsService } from 'app/entities/paypal-completed-payments/paypal-completed-payments.service';

describe('Component Tests', () => {
    describe('PaypalCompletedPayments Management Delete Component', () => {
        let comp: PaypalCompletedPaymentsDeleteDialogComponent;
        let fixture: ComponentFixture<PaypalCompletedPaymentsDeleteDialogComponent>;
        let service: PaypalCompletedPaymentsService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PaypalCompletedPaymentsDeleteDialogComponent]
            })
                .overrideTemplate(PaypalCompletedPaymentsDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PaypalCompletedPaymentsDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaypalCompletedPaymentsService);
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
