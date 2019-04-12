/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { TournamentService } from 'app/entities/tournament/tournament.service';
import { ITournament, Tournament, Type } from 'app/shared/model/tournament.model';

describe('Service Tests', () => {
    describe('Tournament Service', () => {
        let injector: TestBed;
        let service: TournamentService;
        let httpMock: HttpTestingController;
        let elemDefault: ITournament;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(TournamentService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new Tournament(
                0,
                'AAAAAAA',
                'AAAAAAA',
                currentDate,
                'AAAAAAA',
                'AAAAAAA',
                0,
                0,
                'AAAAAAA',
                'AAAAAAA',
                0,
                0,
                Type.ELIMINATION,
                'image/png',
                'AAAAAAA',
                'AAAAAAA'
            );
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        meetingDate: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a Tournament', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        meetingDate: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        meetingDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new Tournament(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a Tournament', async () => {
                const returnedFromService = Object.assign(
                    {
                        title: 'BBBBBB',
                        description: 'BBBBBB',
                        meetingDate: currentDate.format(DATE_TIME_FORMAT),
                        meetingPoint: 'BBBBBB',
                        city: 'BBBBBB',
                        price: 1,
                        playerSize: 1,
                        rewards: 'BBBBBB',
                        imageUrl: 'BBBBBB',
                        latitude: 1,
                        longitude: 1,
                        type: 'BBBBBB',
                        imagen: 'BBBBBB',
                        state: 'BBBBBB'
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        meetingDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of Tournament', async () => {
                const returnedFromService = Object.assign(
                    {
                        title: 'BBBBBB',
                        description: 'BBBBBB',
                        meetingDate: currentDate.format(DATE_TIME_FORMAT),
                        meetingPoint: 'BBBBBB',
                        city: 'BBBBBB',
                        price: 1,
                        playerSize: 1,
                        rewards: 'BBBBBB',
                        imageUrl: 'BBBBBB',
                        latitude: 1,
                        longitude: 1,
                        type: 'BBBBBB',
                        imagen: 'BBBBBB',
                        state: 'BBBBBB'
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        meetingDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .query(expected)
                    .pipe(
                        take(1),
                        map(resp => resp.body)
                    )
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a Tournament', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
