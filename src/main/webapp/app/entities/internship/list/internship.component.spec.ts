import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { InternshipService } from '../service/internship.service';

import { InternshipComponent } from './internship.component';

describe('Internship Management Component', () => {
  let comp: InternshipComponent;
  let fixture: ComponentFixture<InternshipComponent>;
  let service: InternshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [InternshipComponent],
    })
      .overrideTemplate(InternshipComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InternshipComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InternshipService);

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
    expect(comp.internships?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
