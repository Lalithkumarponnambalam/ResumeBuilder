import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PersonalDetailsService } from '../service/personal-details.service';

import { PersonalDetailsComponent } from './personal-details.component';

describe('PersonalDetails Management Component', () => {
  let comp: PersonalDetailsComponent;
  let fixture: ComponentFixture<PersonalDetailsComponent>;
  let service: PersonalDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PersonalDetailsComponent],
    })
      .overrideTemplate(PersonalDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PersonalDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PersonalDetailsService);

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
    expect(comp.personalDetails?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
