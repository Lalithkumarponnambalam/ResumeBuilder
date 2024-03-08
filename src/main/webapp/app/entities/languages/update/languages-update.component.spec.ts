import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LanguagesService } from '../service/languages.service';
import { ILanguages, Languages } from '../languages.model';

import { LanguagesUpdateComponent } from './languages-update.component';

describe('Languages Management Update Component', () => {
  let comp: LanguagesUpdateComponent;
  let fixture: ComponentFixture<LanguagesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let languagesService: LanguagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LanguagesUpdateComponent],
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
      .overrideTemplate(LanguagesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LanguagesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    languagesService = TestBed.inject(LanguagesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const languages: ILanguages = { id: 456 };

      activatedRoute.data = of({ languages });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(languages));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Languages>>();
      const languages = { id: 123 };
      jest.spyOn(languagesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ languages });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: languages }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(languagesService.update).toHaveBeenCalledWith(languages);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Languages>>();
      const languages = new Languages();
      jest.spyOn(languagesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ languages });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: languages }));
      saveSubject.complete();

      // THEN
      expect(languagesService.create).toHaveBeenCalledWith(languages);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Languages>>();
      const languages = { id: 123 };
      jest.spyOn(languagesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ languages });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(languagesService.update).toHaveBeenCalledWith(languages);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
