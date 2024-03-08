import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ExperienceDetailsService } from '../service/experience-details.service';

import { ExperienceDetailsComponent } from './experience-details.component';

describe('ExperienceDetails Management Component', () => {
  let comp: ExperienceDetailsComponent;
  let fixture: ComponentFixture<ExperienceDetailsComponent>;
  let service: ExperienceDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ExperienceDetailsComponent],
    })
      .overrideTemplate(ExperienceDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExperienceDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExperienceDetailsService);

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
    expect(comp.experienceDetails?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
