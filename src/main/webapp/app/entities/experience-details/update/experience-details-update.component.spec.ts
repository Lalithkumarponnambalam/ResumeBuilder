import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExperienceDetailsService } from '../service/experience-details.service';
import { IExperienceDetails, ExperienceDetails } from '../experience-details.model';

import { ExperienceDetailsUpdateComponent } from './experience-details-update.component';

describe('ExperienceDetails Management Update Component', () => {
  let comp: ExperienceDetailsUpdateComponent;
  let fixture: ComponentFixture<ExperienceDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let experienceDetailsService: ExperienceDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExperienceDetailsUpdateComponent],
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
      .overrideTemplate(ExperienceDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExperienceDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    experienceDetailsService = TestBed.inject(ExperienceDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const experienceDetails: IExperienceDetails = { id: 456 };

      activatedRoute.data = of({ experienceDetails });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(experienceDetails));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExperienceDetails>>();
      const experienceDetails = { id: 123 };
      jest.spyOn(experienceDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ experienceDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: experienceDetails }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(experienceDetailsService.update).toHaveBeenCalledWith(experienceDetails);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExperienceDetails>>();
      const experienceDetails = new ExperienceDetails();
      jest.spyOn(experienceDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ experienceDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: experienceDetails }));
      saveSubject.complete();

      // THEN
      expect(experienceDetailsService.create).toHaveBeenCalledWith(experienceDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExperienceDetails>>();
      const experienceDetails = { id: 123 };
      jest.spyOn(experienceDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ experienceDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(experienceDetailsService.update).toHaveBeenCalledWith(experienceDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
