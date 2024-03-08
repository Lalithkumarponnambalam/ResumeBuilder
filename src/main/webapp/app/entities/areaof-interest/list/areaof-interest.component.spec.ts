import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AreaofInterestService } from '../service/areaof-interest.service';

import { AreaofInterestComponent } from './areaof-interest.component';

describe('AreaofInterest Management Component', () => {
  let comp: AreaofInterestComponent;
  let fixture: ComponentFixture<AreaofInterestComponent>;
  let service: AreaofInterestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AreaofInterestComponent],
    })
      .overrideTemplate(AreaofInterestComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AreaofInterestComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AreaofInterestService);

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
    expect(comp.areaofInterests?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
