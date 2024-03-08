import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AreaofInterestService } from '../service/areaof-interest.service';
import { IAreaofInterest, AreaofInterest } from '../areaof-interest.model';

import { AreaofInterestUpdateComponent } from './areaof-interest-update.component';

describe('AreaofInterest Management Update Component', () => {
  let comp: AreaofInterestUpdateComponent;
  let fixture: ComponentFixture<AreaofInterestUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let areaofInterestService: AreaofInterestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AreaofInterestUpdateComponent],
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
      .overrideTemplate(AreaofInterestUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AreaofInterestUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    areaofInterestService = TestBed.inject(AreaofInterestService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const areaofInterest: IAreaofInterest = { id: 456 };

      activatedRoute.data = of({ areaofInterest });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(areaofInterest));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AreaofInterest>>();
      const areaofInterest = { id: 123 };
      jest.spyOn(areaofInterestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ areaofInterest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: areaofInterest }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(areaofInterestService.update).toHaveBeenCalledWith(areaofInterest);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AreaofInterest>>();
      const areaofInterest = new AreaofInterest();
      jest.spyOn(areaofInterestService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ areaofInterest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: areaofInterest }));
      saveSubject.complete();

      // THEN
      expect(areaofInterestService.create).toHaveBeenCalledWith(areaofInterest);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AreaofInterest>>();
      const areaofInterest = { id: 123 };
      jest.spyOn(areaofInterestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ areaofInterest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(areaofInterestService.update).toHaveBeenCalledWith(areaofInterest);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
