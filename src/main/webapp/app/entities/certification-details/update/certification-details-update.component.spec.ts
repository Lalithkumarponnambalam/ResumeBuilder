import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CertificationDetailsService } from '../service/certification-details.service';
import { ICertificationDetails, CertificationDetails } from '../certification-details.model';

import { CertificationDetailsUpdateComponent } from './certification-details-update.component';

describe('CertificationDetails Management Update Component', () => {
  let comp: CertificationDetailsUpdateComponent;
  let fixture: ComponentFixture<CertificationDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let certificationDetailsService: CertificationDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CertificationDetailsUpdateComponent],
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
      .overrideTemplate(CertificationDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CertificationDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    certificationDetailsService = TestBed.inject(CertificationDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const certificationDetails: ICertificationDetails = { id: 456 };

      activatedRoute.data = of({ certificationDetails });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(certificationDetails));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CertificationDetails>>();
      const certificationDetails = { id: 123 };
      jest.spyOn(certificationDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ certificationDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: certificationDetails }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(certificationDetailsService.update).toHaveBeenCalledWith(certificationDetails);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CertificationDetails>>();
      const certificationDetails = new CertificationDetails();
      jest.spyOn(certificationDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ certificationDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: certificationDetails }));
      saveSubject.complete();

      // THEN
      expect(certificationDetailsService.create).toHaveBeenCalledWith(certificationDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CertificationDetails>>();
      const certificationDetails = { id: 123 };
      jest.spyOn(certificationDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ certificationDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(certificationDetailsService.update).toHaveBeenCalledWith(certificationDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
