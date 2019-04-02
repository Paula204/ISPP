/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { PaypalCompletedPaymentsDetailComponent } from 'app/entities/paypal-completed-payments/paypal-completed-payments-detail.component';
import { PaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';

describe('Component Tests', () => {
    describe('PaypalCompletedPayments Management Detail Component', () => {
        let comp: PaypalCompletedPaymentsDetailComponent;
        let fixture: ComponentFixture<PaypalCompletedPaymentsDetailComponent>;
        const route = ({ data: of({ paypalCompletedPayments: new PaypalCompletedPayments(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PaypalCompletedPaymentsDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PaypalCompletedPaymentsDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PaypalCompletedPaymentsDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.paypalCompletedPayments).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
