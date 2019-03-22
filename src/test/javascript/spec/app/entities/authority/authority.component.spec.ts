/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ThorneoTestModule } from '../../../test.module';
import { AuthorityComponent } from 'app/entities/authority/authority.component';
import { AuthorityService } from 'app/entities/authority/authority.service';
import { Authority } from 'app/shared/model/authority.model';

describe('Component Tests', () => {
    describe('Authority Management Component', () => {
        let comp: AuthorityComponent;
        let fixture: ComponentFixture<AuthorityComponent>;
        let service: AuthorityService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [AuthorityComponent],
                providers: []
            })
                .overrideTemplate(AuthorityComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AuthorityComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AuthorityService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Authority(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.authorities[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
