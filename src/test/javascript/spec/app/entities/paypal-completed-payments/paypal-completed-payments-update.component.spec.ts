/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { PaypalCompletedPaymentsUpdateComponent } from 'app/entities/paypal-completed-payments/paypal-completed-payments-update.component';
import { PaypalCompletedPaymentsService } from 'app/entities/paypal-completed-payments/paypal-completed-payments.service';
import { PaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';

describe('Component Tests', () => {
    describe('PaypalCompletedPayments Management Update Component', () => {
        let comp: PaypalCompletedPaymentsUpdateComponent;
        let fixture: ComponentFixture<PaypalCompletedPaymentsUpdateComponent>;
        let service: PaypalCompletedPaymentsService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PaypalCompletedPaymentsUpdateComponent]
            })
                .overrideTemplate(PaypalCompletedPaymentsUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PaypalCompletedPaymentsUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaypalCompletedPaymentsService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new PaypalCompletedPayments(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.paypalCompletedPayments = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new PaypalCompletedPayments();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.paypalCompletedPayments = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
