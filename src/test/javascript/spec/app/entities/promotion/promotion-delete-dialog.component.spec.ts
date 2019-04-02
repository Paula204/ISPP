/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ThorneoTestModule } from '../../../test.module';
import { PromotionDeleteDialogComponent } from 'app/entities/promotion/promotion-delete-dialog.component';
import { PromotionService } from 'app/entities/promotion/promotion.service';

describe('Component Tests', () => {
    describe('Promotion Management Delete Component', () => {
        let comp: PromotionDeleteDialogComponent;
        let fixture: ComponentFixture<PromotionDeleteDialogComponent>;
        let service: PromotionService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [PromotionDeleteDialogComponent]
            })
                .overrideTemplate(PromotionDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PromotionDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PromotionService);
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
