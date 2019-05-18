import { Component, OnInit, OnDestroy, AfterViewInit, Output, NgZone } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { from as fromPromise, Observable, of, Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { Sponsorship } from 'app/shared/model/sponsorship.model';
import { ISponsorship } from 'app/shared/model/sponsorship.model';
import { ITournament } from 'app/shared/model/tournament.model';
import { Account, AccountService } from 'app/core';

import { ITEMS_PER_PAGE } from 'app/shared';
import { TournamentService } from './tournament.service';
import { SponsorshipService } from 'app/entities/sponsorship';

import * as Http from 'http';
import { filter, map, switchMap, tap } from 'rxjs/operators';

declare let $: any;
declare var google: any;

import { Type } from 'app/shared/model/tournament.model';
// import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core/services/google-maps-api-wrapper';
// import { MapsAPILoader,  } from 'angular2-google-maps/core';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';

@Component({
    selector: 'jhi-tournament',
    templateUrl: './tournament.component.html',
    styleUrls: ['tournament-maps.component.css']
})

// extends GoogleMapsAPIWrapper
export class TournamentComponent implements OnInit, OnDestroy {
    currentAccount: Account;
    tournaments: ITournament[];
    error: any;
    success: boolean;
    eventSubscriber: Subscription;
    currentSearch: string;
    routeData: any;
    links: any;
    totalItems: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    sponsorship: ISponsorship;
    type: Type;
    currentDate: Date;
    lat: any;
    lng: any;
    label: any;
    list: any;
    markers: Marker[];
    mark: Marker;
    address: string;
    location: Location;
    loading: boolean;
    geocoder: any;
    entry: any;
    title: string;

    constructor(
        protected tournamentService: TournamentService,
        protected sponsorshipService: SponsorshipService,
        protected parseLinks: JhiParseLinks,
        protected jhiAlertService: JhiAlertService,
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute,
        protected router: Router,
        protected mapLoader: MapsAPILoader,
        // private __loader = MapsAPILoader,
        // private __zone = NgZone,
        protected eventManager: JhiEventManager
    ) {
        // super(__loader,__zone)
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    //    ngAfterViewInit(): void {
    //        this.apiWrapper.getNativeMap().then(map => {
    //        });
    //    }

    loadAll() {
        if (this.currentSearch) {
            this.tournamentService
                .search({
                    page: this.page - 1,
                    query: this.currentSearch,
                    size: this.itemsPerPage,
                    sort: this.sort()
                })
                .subscribe(
                    (res: HttpResponse<ITournament[]>) => this.paginateTournaments(res.body, res.headers),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.tournamentService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<ITournament[]>) => this.paginateTournaments(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/tournament'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate([
            '/tournament',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        ]);
        this.loadAll();
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate([
            '/tournament',
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        ]);
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInTournaments();
        this.sponsorshipService
            .findRandom()
            .pipe(
                filter((response: HttpResponse<Sponsorship>) => response.ok),
                map((sponsorship: HttpResponse<Sponsorship>) => sponsorship.body)
            )
            .subscribe(value => (this.sponsorship = value));
        this.currentDate = new Date();
        this.mapLoader.load;
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITournament) {
        return item.id;
    }

    registerChangeInTournaments() {
        this.eventSubscriber = this.eventManager.subscribe('tournamentListModification', response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    protected paginateTournaments(data: ITournament[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.tournaments = data;
        this.markers = [];
        for (let i = 0; i < this.tournaments.length; i++) {
            this.entry = this.tournaments[i];
            this.address = this.entry.meetingPoint + ' ' + this.entry.city;
            const aux = this.entry.title;
            this.loading = true;
            this.geocodeAddress(this.address).subscribe((location: Location) => {
                this.location = location;
                this.loading = false;
                this.mark = {
                    lng: location.lng,
                    lat: location.lat,
                    label: aux,
                    draggable: false
                };
                this.markers.push(this.mark);
            });
        }
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    private initGeocoder() {
        console.log('Init geocoder!');
        this.geocoder = new google.maps.Geocoder();
    }

    private waitForMapsToLoad(): Observable<boolean> {
        if (!this.geocoder) {
            return fromPromise(this.mapLoader.load()).pipe(
                tap(() => this.initGeocoder()),
                map(() => true)
            );
        }
        return of(true);
    }

    geocodeAddress(location: string): Observable<Location> {
        console.log('Start geocoding!');
        return this.waitForMapsToLoad().pipe(
            // filter(loaded => loaded),
            switchMap(() => {
                return new Observable(observer => {
                    this.geocoder.geocode({ address: location }, (results, status) => {
                        if (status === google.maps.GeocoderStatus.OK) {
                            console.log('Geocoding complete!');
                            observer.next({
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng()
                            });
                        } else {
                            console.log('Error - ', results, ' & Status - ', status);
                            observer.next({ lat: 0, lng: 0 });
                        }
                        observer.complete();
                    });
                });
            })
        );
    }

    /**ngAfterViewInit(): void {
        this.apiWrapper.getNativeMap().then(mapitaBonito => {
            console.log(mapitaBonito);
            console.log(mapitaBonito.getZoom());
        });
    }*/
}

export interface Marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}

export interface Location {
    lat: number;
    lng: number;
}
