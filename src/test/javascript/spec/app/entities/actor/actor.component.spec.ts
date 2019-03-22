/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ThorneoTestModule } from '../../../test.module';
import { ActorComponent } from 'app/entities/actor/actor.component';
import { ActorService } from 'app/entities/actor/actor.service';
import { Actor } from 'app/shared/model/actor.model';

describe('Component Tests', () => {
    describe('Actor Management Component', () => {
        let comp: ActorComponent;
        let fixture: ComponentFixture<ActorComponent>;
        let service: ActorService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ThorneoTestModule],
                declarations: [ActorComponent],
                providers: []
            })
                .overrideTemplate(ActorComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ActorComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ActorService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Actor(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.actors[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
