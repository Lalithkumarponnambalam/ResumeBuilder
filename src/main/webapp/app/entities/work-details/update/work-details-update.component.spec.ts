import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WorkDetailsService } from '../service/work-details.service';
import { IWorkDetails, WorkDetails } from '../work-details.model';

import { WorkDetailsUpdateComponent } from './work-details-update.component';

describe('WorkDetails Management Update Component', () => {
  let comp: WorkDetailsUpdateComponent;
  let fixture: ComponentFixture<WorkDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let workDetailsService: WorkDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [WorkDetailsUpdateComponent],
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
      .overrideTemplate(WorkDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorkDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    workDetailsService = TestBed.inject(WorkDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const workDetails: IWorkDetails = { id: 456 };

      activatedRoute.data = of({ workDetails });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(workDetails));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<WorkDetails>>();
      const workDetails = { id: 123 };
      jest.spyOn(workDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workDetails }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(workDetailsService.update).toHaveBeenCalledWith(workDetails);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<WorkDetails>>();
      const workDetails = new WorkDetails();
      jest.spyOn(workDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workDetails }));
      saveSubject.complete();

      // THEN
      expect(workDetailsService.create).toHaveBeenCalledWith(workDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<WorkDetails>>();
      const workDetails = { id: 123 };
      jest.spyOn(workDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(workDetailsService.update).toHaveBeenCalledWith(workDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
