import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService, User, UserService } from 'app/core';
import { JhiAlertService, JhiParseLinks } from 'ng-jhipster';
import { ActivatedRoute, Router } from '@angular/router';
import { ITEMS_PER_PAGE } from 'app/shared';
import { ITournament, Tournament } from 'app/shared/model/tournament.model';
import { TournamentService } from 'app/entities/tournament';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'jhi-sponsor-list',
    templateUrl: './sponsor-detail.component.html',
    styles: []
})
export class SponsorDetailComponent implements OnInit, OnDestroy {
    currentAccount: any;
    tournaments: Tournament[];
    user: User;
    error: any;
    success: any;
    routeData: any;
    links: any;
    totalItems: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    login: string;

    constructor(
        private tournamentService: TournamentService,
        private userService: UserService,
        private alertService: JhiAlertService,
        private accountService: AccountService,
        private parseLinks: JhiParseLinks,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
    }

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.loadAll();
    }

    ngOnDestroy() {
        this.routeData.unsubscribe();
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/sponsor-list/' + this.login], {
            queryParams: {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    trackId(index: number, item: ITournament) {
        return item.id;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.tournaments = data;
    }

    private onError(error) {
        this.alertService.error(error.error, error.message, null);
    }

    loadAll() {
        this.login = this.activatedRoute.snapshot.paramMap.get('login');
        this.tournamentService
            .tournamentsByUser(this.login)
            .subscribe(
                (res: HttpResponse<Tournament[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpResponse<any>) => this.onError(res.body)
            );
    }
}
