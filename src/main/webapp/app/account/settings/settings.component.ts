import { Component, OnInit } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';

import { AccountService, JhiLanguageHelper, LoginService, User, UserService } from 'app/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsDeleteDialogComponent } from 'app/account';

@Component({
    selector: 'jhi-settings',
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
    error: string;
    success: string;
    settingsAccount: any;
    languages: any[];
    currentUser: User;

    constructor(
        private loginService: LoginService,
        private accountService: AccountService,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private userService: UserService,
        private router: Router,
        private modalService: NgbModal
    ) {}

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.settingsAccount = this.copyAccount(account);
            this.currentUser = account;
        });
        this.languageHelper.getAll().then(languages => {
            this.languages = languages;
        });
    }

    save() {
        this.accountService.save(this.settingsAccount).subscribe(
            () => {
                this.error = null;
                this.success = 'OK';
                this.accountService.identity(true).then(account => {
                    this.settingsAccount = this.copyAccount(account);
                });
                this.languageService.getCurrent().then(current => {
                    if (this.settingsAccount.langKey !== current) {
                        this.languageService.changeLanguage(this.settingsAccount.langKey);
                    }
                });
            },
            () => {
                this.success = null;
                this.error = 'ERROR';
            }
        );
    }

    deleteUser() {
        const modalRef = this.modalService.open(SettingsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.user = this.currentUser;
        modalRef.result.then(
            result => {
                // Left blank intentionally, nothing to do here
            },
            reason => {
                // Left blank intentionally, nothing to do here
            }
        );
    }

    copyAccount(account) {
        return {
            activated: account.activated,
            email: account.email,
            firstName: account.firstName,
            langKey: account.langKey,
            lastName: account.lastName,
            login: account.login,
            imageUrl: account.imageUrl
        };
    }
}
