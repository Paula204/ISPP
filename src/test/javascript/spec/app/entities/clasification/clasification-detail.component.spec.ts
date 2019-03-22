/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { ClasificationDetailComponent } from 'app/entities/clasification/clasification-detail.component';
import { Clasification } from 'app/shared/model/clasification.model';

describe('Component Tests', () => {
    describe('Clasification Management Detail Component', () => {
        let comp: ClasificationDetailComponent;
        let fixture: ComponentFixture<ClasificationDetailComponent>;
        const route = ({ data: of({ clasification: new Clasification(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [ClasificationDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ClasificationDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ClasificationDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.clasification).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
