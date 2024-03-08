import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EducationDetailsService } from '../service/education-details.service';

import { EducationDetailsComponent } from './education-details.component';

describe('EducationDetails Management Component', () => {
  let comp: EducationDetailsComponent;
  let fixture: ComponentFixture<EducationDetailsComponent>;
  let service: EducationDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EducationDetailsComponent],
    })
      .overrideTemplate(EducationDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EducationDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EducationDetailsService);

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
    expect(comp.educationDetails?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
