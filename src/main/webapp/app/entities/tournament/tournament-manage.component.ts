import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITournament, ITournamentForm, Tournament } from 'app/shared/model/tournament.model';
import { TournamentService } from '.';
import { ParticipationService } from 'app/entities/participation';
import { Observable } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';
import { Account, AccountService } from 'app/core';
import * as $ from 'jquery';
//import * as bracket from "jquery-bracket";

@Component({
    selector: 'jhi-tournament-manage',
    templateUrl: './tournament-manage.component.html'
})
export class TournamentManageComponent implements OnInit {
    tournament: ITournamentForm;

    currentAccount: Account;
    currentDate: Date;

    isSaving: boolean;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService,
        protected tournamentService: TournamentService,
        protected participationService: ParticipationService
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ tournament }) => {
            this.tournament = tournament;
        });
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.currentDate = new Date();

        var $prueba = $('.prueba'),
            $bracket = $('<ul class="bracket"><li></li><li></li></ul>');

        var participants = [
            'Adam',
            'Matt',
            'Evan',
            'Abby',
            'Heather',
            'Christina',
            'Ryan',
            'Tyler',
            'Steve',
            'Steph',
            'Jenna',
            'Derek',
            'Mike',
            'Sam'
        ];

        function buildBracket($el, p1, p2) {
            if (!p1 && !p2) {
                $el.append($bracket.clone());
            }
        }

        buildBracket($prueba);

        var level = 0,
            section = 0,
            $brackets,
            $previousBrackets;

        while (level < 4) {
            $brackets = $('.bracket');

            $brackets = $brackets.filter(function(i, el) {
                if ($previousBrackets) {
                    if ($.inArray(el, $previousBrackets) >= 0) {
                        return false;
                    }
                }
                return true;
            });

            if (!$previousBrackets) {
                $previousBrackets = $brackets;
            } else {
                $previousBrackets = $.merge($previousBrackets, $brackets);
            }

            $brackets.each(function() {
                $(this)
                    .find('li:empty')
                    .each(function() {
                        buildBracket($(this));
                    });
            });

            level++;
        }

        function getRivals() {
            var p1i = Math.floor(participants.length * Math.random()),
                p1 = participants[p1i];
            participants.splice(p1i, 1);
            var p2i = Math.floor(participants.length * Math.random()),
                p2 = participants[p2i];
            participants.splice(p2i, 1);
            return [p1, p2];
        }

        function cleanUp() {
            var $brackets = $('.bracket'),
                removed = false;
            for (var i = 0; i < $brackets.length; i++) {
                // break before there aren't enough spots
                if ($('li:empty').length === participants.length) break;

                var empty = true;
                $brackets
                    .eq(i)
                    .find('li')
                    .each(function() {
                        if (!$(this).is(':empty')) {
                            empty = false;
                        }
                    });
                if (empty) {
                    $brackets.eq(i).remove();
                    removed = true;
                }
            }
            return removed;
        }

        // just do it over and over
        while (cleanUp()) {}

        var $empty = $('li:empty');
        for (var i = 0; i < participants.length; i++) {
            $empty.eq(i).html('<button>' + participants[i] + '</button>');
        }

        function changeToButtons() {
            $('.bracket').each(function() {
                var $winner = $(this).children('.winner');
                if ($winner.length === 0) {
                    var $winners = $(this)
                        .children('li')
                        .children('ul')
                        .children('.winner');
                    if ($winners.length === 2) {
                        $winners.each(function() {
                            $(this).html('<button class="winner">' + $(this).text() + '</button>');
                        });
                    }
                }
            });
        }

        $(document).on('click', 'button', function() {
            var $ul;
            if (!$(this).hasClass('winner')) {
                $ul = $(this)
                    .parent()
                    .parent();
            } else {
                $ul = $(this)
                    .parent()
                    .parent()
                    .parent()
                    .parent();
                console.log($ul);
            }
            $ul.append($('<li class="winner">' + $(this).text() + '</li>'));
            $ul.find('button').each(function() {
                $(this).replaceWith($(this).text());
            });
            changeToButtons();
        });
    }

    previousState() {
        window.history.back();
    }

    signOn() {
        this.isSaving = true;

        if (this.tournament.participations === null) {
            this.tournament.participations = [];
        }

        this.subscribeToSaveResponse(this.tournamentService.signOn(this.tournament));
    }

    close() {
        this.isSaving = true;

        this.subscribeToSaveResponse(this.tournamentService.close(this.tournament));
    }

    disqualify(id: number) {
        this.isSaving = true;

        this.subscribeToSaveResponse(this.participationService.disqualify(id));
    }

    win(id: number) {
        this.isSaving = true;

        this.subscribeToSaveResponse(this.participationService.win(id));
    }

    tie(id: number) {
        this.isSaving = true;

        this.subscribeToSaveResponse(this.participationService.tie(id));
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ITournament>>) {
        result.subscribe((res: HttpResponse<ITournament>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
