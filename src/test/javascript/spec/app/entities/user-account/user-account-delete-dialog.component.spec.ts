/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ThorneoTestModule } from '../../../test.module';
import { UserAccountDeleteDialogComponent } from 'app/entities/user-account/user-account-delete-dialog.component';
import { UserAccountService } from 'app/entities/user-account/user-account.service';

describe('Component Tests', () => {
    describe('UserAccount Management Delete Component', () => {
        let comp: UserAccountDeleteDialogComponent;
        let fixture: ComponentFixture<UserAccountDeleteDialogComponent>;
        let service: UserAccountService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [UserAccountDeleteDialogComponent]
            })
                .overrideTemplate(UserAccountDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(UserAccountDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UserAccountService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
