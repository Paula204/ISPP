import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { IPaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';
import { PaypalCompletedPayments } from 'app/shared/model/paypal-completed-payments.model';
import { PaypalCompletedPaymentsService } from 'app/entities/paypal-completed-payments/paypal-completed-payments.service';
import { AccountService } from 'app/core/auth/account.service';
import { IUser, User, UserService } from 'app/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { TournamentService } from 'app/entities/tournament';
import { ITournament, Tournament } from 'app/shared/model/tournament.model';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { JhiLanguageService } from 'ng-jhipster';

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
    amount: number;
    cycles: number;
    frequency: string;
    pagoTorneo: boolean;
    isUser: any;
    isSponsor: any;

    constructor(
        protected paypalCompletedPaymentsService: PaypalCompletedPaymentsService,
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute,
        protected tournamentService: TournamentService,
        private router: Router,
        protected translateService: TranslateService,
        private lang: JhiLanguageService
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.idTorneo = params['idTorneo'];
        });
        this.message = 'PaypalPaymentsComponent message';
        console.log('==================================');
        const res = activatedRoute.snapshot.url.length;
        this.route = activatedRoute.snapshot.url[res - 1].toString();
    }
    ngOnInit() {
        this.accountService.identity().then(account => {
            this.currentUser = account;
        });
        if (this.route !== 'premium' && this.route !== 'sponsor') {
            const torneos = this.tournamentService.find(+this.route);
            torneos.subscribe((tournament: HttpResponse<ITournament>) => {
                this.torneo = tournament.body;
            });
        }
        this.accountService.hasAuthority('ROLE_SPONSOR').then(role => {
            this.isSponsor = role;
        });
        this.accountService.hasAuthority('ROLE_USER').then(role => {
            this.isUser = role;
        });
    }

    ngAfterViewChecked() {
        if (!this.addScript) {
            this.addPaypalScript().then(() => {
                const _this = this;

                if (_this.route === 'sponsor') {
                    _this.amount = 22.45;
                    _this.cycles = 12;
                    _this.frequency = 'Month';
                } else if (_this.route === 'premium') {
                    _this.amount = 225.42;
                    _this.cycles = 1;
                    _this.frequency = 'Year';
                } else {
                    if (this.isSponsor === false && this.isUser === true) {
                        _this.amount = _this.torneo.price + _this.torneo.price * 0.09;
                    } else {
                        _this.amount = _this.torneo.price;
                    }
                    _this.cycles = 1;
                    _this.frequency = 'Year';
                }
                paypal
                    .Buttons({
                        createOrder(data, actions) {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        type: 'REGULAR',
                                        frequency: _this.frequency,
                                        amount: {
                                            value: _this.amount
                                        },
                                        cycles: _this.cycles
                                    }
                                ]
                            });
                            /*purchase_units: [
                                    {
                                        amount: {
                                            value: _this.amount,
                                        },
                                    }
                                ]*/
                        },
                        onApprove(data, actions) {
                            // Capture the funds from the transaction
                            actions.order.capture().then(function(details) {
                                // Show a success message to your buyer
                                if (_this.lang.currentLang === 'es') {
                                    alert('Transaccion completada');
                                } else {
                                    alert('Transaction completed');
                                }
                                // redirigir
                                _this.router.navigate(['/tournament/']);
                                // by ' + details.payer.name.given_name
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
                                    _this.upgradeSponsor();
                                }
                                if (_this.route === 'sponsor') {
                                    _this.upgradeSponsor();
                                } else {
                                    _this.upgradeThorneo();
                                    this.pagoTorneo = true;
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
        this.subscribeToSaveResponse(this.tournamentService.signOn(this.torneo));
    }
}
