import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LanguagesDetailComponent } from './languages-detail.component';

describe('Languages Management Detail Component', () => {
  let comp: LanguagesDetailComponent;
  let fixture: ComponentFixture<LanguagesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LanguagesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ languages: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LanguagesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LanguagesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load languages on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.languages).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
