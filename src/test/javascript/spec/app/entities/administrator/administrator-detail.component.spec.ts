/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { AdministratorDetailComponent } from 'app/entities/administrator/administrator-detail.component';
import { Administrator } from 'app/shared/model/administrator.model';

describe('Component Tests', () => {
    describe('Administrator Management Detail Component', () => {
        let comp: AdministratorDetailComponent;
        let fixture: ComponentFixture<AdministratorDetailComponent>;
        const route = ({ data: of({ administrator: new Administrator(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [AdministratorDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(AdministratorDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(AdministratorDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.administrator).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
