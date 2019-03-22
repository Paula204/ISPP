/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ThorneoTestModule } from '../../../test.module';
import { AuthorityDetailComponent } from 'app/entities/authority/authority-detail.component';
import { Authority } from 'app/shared/model/authority.model';

describe('Component Tests', () => {
    describe('Authority Management Detail Component', () => {
        let comp: AuthorityDetailComponent;
        let fixture: ComponentFixture<AuthorityDetailComponent>;
        const route = ({ data: of({ authority: new Authority(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [AuthorityDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(AuthorityDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(AuthorityDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.authority).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
