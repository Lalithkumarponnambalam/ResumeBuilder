import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ResumeService } from '../service/resume.service';

import { ResumeComponent } from './resume.component';

describe('Resume Management Component', () => {
  let comp: ResumeComponent;
  let fixture: ComponentFixture<ResumeComponent>;
  let service: ResumeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ResumeComponent],
    })
      .overrideTemplate(ResumeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ResumeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ResumeService);

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
    expect(comp.resumes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
