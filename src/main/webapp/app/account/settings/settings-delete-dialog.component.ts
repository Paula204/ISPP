import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginService, User, UserService } from 'app/core';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-user-mgmt-delete-dialog',
    templateUrl: './settings-delete-dialog.component.html'
})
export class SettingsDeleteDialogComponent {
    user: User;

    constructor(
        private userService: UserService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private loginService: LoginService,
        private router: Router
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(login) {
        this.userService.delete(login).subscribe(response => {
            this.loginService.logout();
            this.router.navigate(['']);
            this.activeModal.dismiss(true);
        });
    }
}
