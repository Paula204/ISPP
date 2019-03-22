/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { FreeDetailComponent } from 'app/entities/free/free-detail.component';
import { Free } from 'app/shared/model/free.model';

describe('Component Tests', () => {
    describe('Free Management Detail Component', () => {
        let comp: FreeDetailComponent;
        let fixture: ComponentFixture<FreeDetailComponent>;
        const route = ({ data: of({ free: new Free(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [FreeDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(FreeDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(FreeDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.free).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
