import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InternshipService } from '../service/internship.service';
import { IInternship, Internship } from '../internship.model';

import { InternshipUpdateComponent } from './internship-update.component';

describe('Internship Management Update Component', () => {
  let comp: InternshipUpdateComponent;
  let fixture: ComponentFixture<InternshipUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let internshipService: InternshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InternshipUpdateComponent],
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
      .overrideTemplate(InternshipUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InternshipUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    internshipService = TestBed.inject(InternshipService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const internship: IInternship = { id: 456 };

      activatedRoute.data = of({ internship });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(internship));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Internship>>();
      const internship = { id: 123 };
      jest.spyOn(internshipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ internship });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: internship }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(internshipService.update).toHaveBeenCalledWith(internship);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Internship>>();
      const internship = new Internship();
      jest.spyOn(internshipService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ internship });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: internship }));
      saveSubject.complete();

      // THEN
      expect(internshipService.create).toHaveBeenCalledWith(internship);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Internship>>();
      const internship = { id: 123 };
      jest.spyOn(internshipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ internship });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(internshipService.update).toHaveBeenCalledWith(internship);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
