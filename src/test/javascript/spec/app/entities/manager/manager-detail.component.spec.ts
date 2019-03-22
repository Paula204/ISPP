/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { ManagerDetailComponent } from 'app/entities/manager/manager-detail.component';
import { Manager } from 'app/shared/model/manager.model';

describe('Component Tests', () => {
    describe('Manager Management Detail Component', () => {
        let comp: ManagerDetailComponent;
        let fixture: ComponentFixture<ManagerDetailComponent>;
        const route = ({ data: of({ manager: new Manager(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [ManagerDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ManagerDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ManagerDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.manager).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
