import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SocialLinksDetailComponent } from './social-links-detail.component';

describe('SocialLinks Management Detail Component', () => {
  let comp: SocialLinksDetailComponent;
  let fixture: ComponentFixture<SocialLinksDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialLinksDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ socialLinks: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SocialLinksDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SocialLinksDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load socialLinks on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.socialLinks).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
