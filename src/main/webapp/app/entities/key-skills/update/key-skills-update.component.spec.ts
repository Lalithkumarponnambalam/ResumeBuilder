import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { KeySkillsService } from '../service/key-skills.service';
import { IKeySkills, KeySkills } from '../key-skills.model';

import { KeySkillsUpdateComponent } from './key-skills-update.component';

describe('KeySkills Management Update Component', () => {
  let comp: KeySkillsUpdateComponent;
  let fixture: ComponentFixture<KeySkillsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let keySkillsService: KeySkillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [KeySkillsUpdateComponent],
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
      .overrideTemplate(KeySkillsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KeySkillsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    keySkillsService = TestBed.inject(KeySkillsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const keySkills: IKeySkills = { id: 456 };

      activatedRoute.data = of({ keySkills });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(keySkills));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<KeySkills>>();
      const keySkills = { id: 123 };
      jest.spyOn(keySkillsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ keySkills });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: keySkills }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(keySkillsService.update).toHaveBeenCalledWith(keySkills);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<KeySkills>>();
      const keySkills = new KeySkills();
      jest.spyOn(keySkillsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ keySkills });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: keySkills }));
      saveSubject.complete();

      // THEN
      expect(keySkillsService.create).toHaveBeenCalledWith(keySkills);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<KeySkills>>();
      const keySkills = { id: 123 };
      jest.spyOn(keySkillsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ keySkills });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(keySkillsService.update).toHaveBeenCalledWith(keySkills);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
