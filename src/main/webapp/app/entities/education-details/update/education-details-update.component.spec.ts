import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EducationDetailsService } from '../service/education-details.service';
import { IEducationDetails, EducationDetails } from '../education-details.model';

import { EducationDetailsUpdateComponent } from './education-details-update.component';

describe('EducationDetails Management Update Component', () => {
  let comp: EducationDetailsUpdateComponent;
  let fixture: ComponentFixture<EducationDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let educationDetailsService: EducationDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EducationDetailsUpdateComponent],
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
      .overrideTemplate(EducationDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EducationDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    educationDetailsService = TestBed.inject(EducationDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const educationDetails: IEducationDetails = { id: 456 };

      activatedRoute.data = of({ educationDetails });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(educationDetails));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EducationDetails>>();
      const educationDetails = { id: 123 };
      jest.spyOn(educationDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ educationDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: educationDetails }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(educationDetailsService.update).toHaveBeenCalledWith(educationDetails);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EducationDetails>>();
      const educationDetails = new EducationDetails();
      jest.spyOn(educationDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ educationDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: educationDetails }));
      saveSubject.complete();

      // THEN
      expect(educationDetailsService.create).toHaveBeenCalledWith(educationDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EducationDetails>>();
      const educationDetails = { id: 123 };
      jest.spyOn(educationDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ educationDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(educationDetailsService.update).toHaveBeenCalledWith(educationDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
