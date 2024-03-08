import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SocialLinksService } from '../service/social-links.service';

import { SocialLinksComponent } from './social-links.component';

describe('SocialLinks Management Component', () => {
  let comp: SocialLinksComponent;
  let fixture: ComponentFixture<SocialLinksComponent>;
  let service: SocialLinksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SocialLinksComponent],
    })
      .overrideTemplate(SocialLinksComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SocialLinksComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SocialLinksService);

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
    expect(comp.socialLinks?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
