import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { WorkDetailsService } from '../service/work-details.service';

import { WorkDetailsComponent } from './work-details.component';

describe('WorkDetails Management Component', () => {
  let comp: WorkDetailsComponent;
  let fixture: ComponentFixture<WorkDetailsComponent>;
  let service: WorkDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [WorkDetailsComponent],
    })
      .overrideTemplate(WorkDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorkDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(WorkDetailsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.workDetails?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
