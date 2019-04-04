import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { IPaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';
import { PaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';
import { PaypalCompletedPaymentsService } from 'app/entities/paypal-completed-payments/paypal-completed-payments.service';
import { AccountService } from 'app/core/auth/account.service';
import { IUser, User, UserService } from 'app/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { TournamentService } from 'app/entities/tournament';
import { Tournament } from 'app/shared/model/tournament.model';

declare let paypal: any;

@Component({
    selector: 'jhi-paypal-payments',
    templateUrl: './paypal-payments.component.html',
    styleUrls: ['paypal-payments.component.scss']
})
export class PaypalPaymentsComponent implements OnInit, AfterViewChecked {
    paypalPayment: IPaypalCompletedPayments = new PaypalCompletedPayments(null, moment(), '', '', 1, '', '', '');

    message: string;
    isSaving: boolean;
    addScript = false;
    paypalLoad = true;

    currentUser: User;

    route: string;
    idTorneo: number;
    torneo: Tournament;

    constructor(
        protected paypalCompletedPaymentsService: PaypalCompletedPaymentsService,
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute,
        protected tournamentService: TournamentService
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.idTorneo = params['idTorneo'];
            alert(this.idTorneo);
        });
        this.message = 'PaypalPaymentsComponent message';
        console.log('==================================');
        let url = activatedRoute.snapshot.url.length;
        this.route = activatedRoute.snapshot.url[url - 1].toString();
    }

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.currentUser = account;
        });
    }

    ngAfterViewChecked() {
        if (!this.addScript) {
            this.addPaypalScript().then(() => {
                const _this = this;
                paypal
                    .Buttons({
                        createOrder(data, actions) {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: '0.10'
                                        }
                                    }
                                ]
                            });
                        },
                        onApprove(data, actions) {
                            // Capture the funds from the transaction
                            actions.order.capture().then(function(details) {
                                // Show a success message to your buyer
                                alert('Transaction completed by ' + details.payer.name.given_name);
                                _this.isSaving = true;
                                _this.paypalPayment.date = moment();
                                _this.paypalPayment.idPayment = details.id;
                                _this.paypalPayment.currency = details.purchase_units[0].amount.currency_code;
                                _this.paypalPayment.amount = details.purchase_units[0].amount.value;
                                _this.paypalPayment.email = details.payer.email_address;
                                _this.paypalPayment.name = details.purchase_units[0].shipping.name.full_name;
                                _this.paypalPayment.status = details.status;
                                _this.accountService
                                    .fetch()
                                    .toPromise()
                                    .then(response => {
                                        const account = response.body;
                                        if (account) {
                                            _this.paypalPayment.user = account;
                                        }
                                        _this.subscribeToSaveResponse(_this.paypalCompletedPaymentsService.create(_this.paypalPayment));
                                    });
                                if (_this.route === 'premium') {
                                    _this.upgradePremium();
                                }
                                if (_this.route === 'sponsor') {
                                    _this.upgradeSponsor();
                                }
                                if (_this.route === 'inscribeTorneo') {
                                    _this.upgradeThorneo();
                                }
                            });
                        }
                    })
                    .render('#paypal-checkout-btn');
                this.paypalLoad = false;
            });
        }
    }

    addPaypalScript() {
        this.addScript = true;
        return new Promise((resolve, reject) => {
            const scripttagElement = document.createElement('script');
            scripttagElement.src =
                'https://www.paypal.com/sdk/js?client-id=AW4dDSqwdQ7jtlcUywucYvBIBt0e5HOJhMrxD2sdpA-nr4i3STRcjDS-qUNq9CsJ6q3eGrACFf5Tqqw_';
            // last paypal script (before february 2019)
            // scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
            scripttagElement.onload = resolve;
            document.body.appendChild(scripttagElement);
        });
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaypalCompletedPayments>>) {
        result.subscribe(
            (res: HttpResponse<IPaypalCompletedPayments>) => this.onSaveSuccess(),
            (res: HttpErrorResponse) => this.onSaveError()
        );
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        console.log('Payment success with entity creation.');
    }

    protected onSaveError() {
        this.isSaving = false;
        console.log('Fail to create payment entity.');
    }

    upgradePremium() {
        this.currentUser.authorities.push('ROLE_PREMIUM');
        this.accountService.upgradePremium(this.currentUser).subscribe(
            () => {
                this.onSaveSuccess();
            },
            () => {
                this.onSaveError();
            }
        );
    }

    upgradeSponsor() {
        this.currentUser.authorities.push('ROLE_SPONSOR');
        this.accountService.upgradeSponsor(this.currentUser).subscribe(
            () => {
                this.onSaveSuccess();
            },
            () => {
                this.onSaveError();
            }
        );
    }

    upgradeThorneo() {
        console.log(this.idTorneo);
        if (this.torneo.participations === null) {
            this.torneo.participations = [];
        }
        alert(this.torneo.title);
        this.subscribeToSaveResponse(this.tournamentService.signOn(this.torneo));
    }
}
