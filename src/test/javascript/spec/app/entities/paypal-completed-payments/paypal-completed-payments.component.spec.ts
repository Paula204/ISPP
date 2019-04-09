/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ThorneoTestModule } from '../../../test.module';
import { PaypalCompletedPaymentsComponent } from 'app/entities/paypal-completed-payments/paypal-completed-payments.component';
import { PaypalCompletedPaymentsService } from 'app/entities/paypal-completed-payments/paypal-completed-payments.service';
import { PaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';

describe('Component Tests', () => {
    describe('PaypalCompletedPayments Management Component', () => {
        let comp: PaypalCompletedPaymentsComponent;
        let fixture: ComponentFixture<PaypalCompletedPaymentsComponent>;
        let service: PaypalCompletedPaymentsService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PaypalCompletedPaymentsComponent],
                providers: []
            })
                .overrideTemplate(PaypalCompletedPaymentsComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PaypalCompletedPaymentsComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaypalCompletedPaymentsService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new PaypalCompletedPayments(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.paypalCompletedPayments[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
