import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CertificationDetailsService } from '../service/certification-details.service';

import { CertificationDetailsComponent } from './certification-details.component';

describe('CertificationDetails Management Component', () => {
  let comp: CertificationDetailsComponent;
  let fixture: ComponentFixture<CertificationDetailsComponent>;
  let service: CertificationDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CertificationDetailsComponent],
    })
      .overrideTemplate(CertificationDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CertificationDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CertificationDetailsService);

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
    expect(comp.certificationDetails?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
