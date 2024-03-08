import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SocialLinksService } from '../service/social-links.service';
import { ISocialLinks, SocialLinks } from '../social-links.model';

import { SocialLinksUpdateComponent } from './social-links-update.component';

describe('SocialLinks Management Update Component', () => {
  let comp: SocialLinksUpdateComponent;
  let fixture: ComponentFixture<SocialLinksUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let socialLinksService: SocialLinksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SocialLinksUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SocialLinksUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SocialLinksUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    socialLinksService = TestBed.inject(SocialLinksService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const socialLinks: ISocialLinks = { id: 456 };

      activatedRoute.data = of({ socialLinks });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(socialLinks));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SocialLinks>>();
      const socialLinks = { id: 123 };
      jest.spyOn(socialLinksService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ socialLinks });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: socialLinks }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(socialLinksService.update).toHaveBeenCalledWith(socialLinks);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SocialLinks>>();
      const socialLinks = new SocialLinks();
      jest.spyOn(socialLinksService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ socialLinks });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: socialLinks }));
      saveSubject.complete();

      // THEN
      expect(socialLinksService.create).toHaveBeenCalledWith(socialLinks);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SocialLinks>>();
      const socialLinks = { id: 123 };
      jest.spyOn(socialLinksService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ socialLinks });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(socialLinksService.update).toHaveBeenCalledWith(socialLinks);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
