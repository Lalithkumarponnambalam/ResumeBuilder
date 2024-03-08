import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ResumeService } from '../service/resume.service';
import { IResume, Resume } from '../resume.model';
import { IPersonalDetails } from 'app/entities/personal-details/personal-details.model';
import { PersonalDetailsService } from 'app/entities/personal-details/service/personal-details.service';
import { IWorkDetails } from 'app/entities/work-details/work-details.model';
import { WorkDetailsService } from 'app/entities/work-details/service/work-details.service';
import { IExperienceDetails } from 'app/entities/experience-details/experience-details.model';
import { ExperienceDetailsService } from 'app/entities/experience-details/service/experience-details.service';
import { IEducationDetails } from 'app/entities/education-details/education-details.model';
import { EducationDetailsService } from 'app/entities/education-details/service/education-details.service';
import { ICertificationDetails } from 'app/entities/certification-details/certification-details.model';
import { CertificationDetailsService } from 'app/entities/certification-details/service/certification-details.service';
import { ILanguages } from 'app/entities/languages/languages.model';
import { LanguagesService } from 'app/entities/languages/service/languages.service';
import { IKeySkills } from 'app/entities/key-skills/key-skills.model';
import { KeySkillsService } from 'app/entities/key-skills/service/key-skills.service';
import { IAreaofInterest } from 'app/entities/areaof-interest/areaof-interest.model';
import { AreaofInterestService } from 'app/entities/areaof-interest/service/areaof-interest.service';
import { ISocialLinks } from 'app/entities/social-links/social-links.model';
import { SocialLinksService } from 'app/entities/social-links/service/social-links.service';
import { IInternship } from 'app/entities/internship/internship.model';
import { InternshipService } from 'app/entities/internship/service/internship.service';

import { ResumeUpdateComponent } from './resume-update.component';

describe('Resume Management Update Component', () => {
  let comp: ResumeUpdateComponent;
  let fixture: ComponentFixture<ResumeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let resumeService: ResumeService;
  let personalDetailsService: PersonalDetailsService;
  let workDetailsService: WorkDetailsService;
  let experienceDetailsService: ExperienceDetailsService;
  let educationDetailsService: EducationDetailsService;
  let certificationDetailsService: CertificationDetailsService;
  let languagesService: LanguagesService;
  let keySkillsService: KeySkillsService;
  let areaofInterestService: AreaofInterestService;
  let socialLinksService: SocialLinksService;
  let internshipService: InternshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ResumeUpdateComponent],
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
      .overrideTemplate(ResumeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ResumeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    resumeService = TestBed.inject(ResumeService);
    personalDetailsService = TestBed.inject(PersonalDetailsService);
    workDetailsService = TestBed.inject(WorkDetailsService);
    experienceDetailsService = TestBed.inject(ExperienceDetailsService);
    educationDetailsService = TestBed.inject(EducationDetailsService);
    certificationDetailsService = TestBed.inject(CertificationDetailsService);
    languagesService = TestBed.inject(LanguagesService);
    keySkillsService = TestBed.inject(KeySkillsService);
    areaofInterestService = TestBed.inject(AreaofInterestService);
    socialLinksService = TestBed.inject(SocialLinksService);
    internshipService = TestBed.inject(InternshipService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call personalDetails query and add missing value', () => {
      const resume: IResume = { id: 456 };
      const personalDetails: IPersonalDetails = { id: 73331 };
      resume.personalDetails = personalDetails;

      const personalDetailsCollection: IPersonalDetails[] = [{ id: 76869 }];
      jest.spyOn(personalDetailsService, 'query').mockReturnValue(of(new HttpResponse({ body: personalDetailsCollection })));
      const expectedCollection: IPersonalDetails[] = [personalDetails, ...personalDetailsCollection];
      jest.spyOn(personalDetailsService, 'addPersonalDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      expect(personalDetailsService.query).toHaveBeenCalled();
      expect(personalDetailsService.addPersonalDetailsToCollectionIfMissing).toHaveBeenCalledWith(
        personalDetailsCollection,
        personalDetails
      );
      expect(comp.personalDetailsCollection).toEqual(expectedCollection);
    });

    it('Should call workDetails query and add missing value', () => {
      const resume: IResume = { id: 456 };
      const workDetails: IWorkDetails = { id: 26636 };
      resume.workDetails = workDetails;

      const workDetailsCollection: IWorkDetails[] = [{ id: 35699 }];
      jest.spyOn(workDetailsService, 'query').mockReturnValue(of(new HttpResponse({ body: workDetailsCollection })));
      const expectedCollection: IWorkDetails[] = [workDetails, ...workDetailsCollection];
      jest.spyOn(workDetailsService, 'addWorkDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      expect(workDetailsService.query).toHaveBeenCalled();
      expect(workDetailsService.addWorkDetailsToCollectionIfMissing).toHaveBeenCalledWith(workDetailsCollection, workDetails);
      expect(comp.workDetailsCollection).toEqual(expectedCollection);
    });

    it('Should call experienceDetails query and add missing value', () => {
      const resume: IResume = { id: 456 };
      const experienceDetails: IExperienceDetails = { id: 36557 };
      resume.experienceDetails = experienceDetails;

      const experienceDetailsCollection: IExperienceDetails[] = [{ id: 943 }];
      jest.spyOn(experienceDetailsService, 'query').mockReturnValue(of(new HttpResponse({ body: experienceDetailsCollection })));
      const expectedCollection: IExperienceDetails[] = [experienceDetails, ...experienceDetailsCollection];
      jest.spyOn(experienceDetailsService, 'addExperienceDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      expect(experienceDetailsService.query).toHaveBeenCalled();
      expect(experienceDetailsService.addExperienceDetailsToCollectionIfMissing).toHaveBeenCalledWith(
        experienceDetailsCollection,
        experienceDetails
      );
      expect(comp.experienceDetailsCollection).toEqual(expectedCollection);
    });

    it('Should call educationDetails query and add missing value', () => {
      const resume: IResume = { id: 456 };
      const educationDetails: IEducationDetails = { id: 68666 };
      resume.educationDetails = educationDetails;

      const educationDetailsCollection: IEducationDetails[] = [{ id: 39677 }];
      jest.spyOn(educationDetailsService, 'query').mockReturnValue(of(new HttpResponse({ body: educationDetailsCollection })));
      const expectedCollection: IEducationDetails[] = [educationDetails, ...educationDetailsCollection];
      jest.spyOn(educationDetailsService, 'addEducationDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      expect(educationDetailsService.query).toHaveBeenCalled();
      expect(educationDetailsService.addEducationDetailsToCollectionIfMissing).toHaveBeenCalledWith(
        educationDetailsCollection,
        educationDetails
      );
      expect(comp.educationDetailsCollection).toEqual(expectedCollection);
    });

    it('Should call certificationDetails query and add missing value', () => {
      const resume: IResume = { id: 456 };
      const certificationDetails: ICertificationDetails = { id: 16016 };
      resume.certificationDetails = certificationDetails;

      const certificationDetailsCollection: ICertificationDetails[] = [{ id: 90282 }];
      jest.spyOn(certificationDetailsService, 'query').mockReturnValue(of(new HttpResponse({ body: certificationDetailsCollection })));
      const expectedCollection: ICertificationDetails[] = [certificationDetails, ...certificationDetailsCollection];
      jest.spyOn(certificationDetailsService, 'addCertificationDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      expect(certificationDetailsService.query).toHaveBeenCalled();
      expect(certificationDetailsService.addCertificationDetailsToCollectionIfMissing).toHaveBeenCalledWith(
        certificationDetailsCollection,
        certificationDetails
      );
      expect(comp.certificationDetailsCollection).toEqual(expectedCollection);
    });

    it('Should call languages query and add missing value', () => {
      const resume: IResume = { id: 456 };
      const languages: ILanguages = { id: 2503 };
      resume.languages = languages;

      const languagesCollection: ILanguages[] = [{ id: 82168 }];
      jest.spyOn(languagesService, 'query').mockReturnValue(of(new HttpResponse({ body: languagesCollection })));
      const expectedCollection: ILanguages[] = [languages, ...languagesCollection];
      jest.spyOn(languagesService, 'addLanguagesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      expect(languagesService.query).toHaveBeenCalled();
      expect(languagesService.addLanguagesToCollectionIfMissing).toHaveBeenCalledWith(languagesCollection, languages);
      expect(comp.languagesCollection).toEqual(expectedCollection);
    });

    it('Should call keySkills query and add missing value', () => {
      const resume: IResume = { id: 456 };
      const keySkills: IKeySkills = { id: 6990 };
      resume.keySkills = keySkills;

      const keySkillsCollection: IKeySkills[] = [{ id: 19439 }];
      jest.spyOn(keySkillsService, 'query').mockReturnValue(of(new HttpResponse({ body: keySkillsCollection })));
      const expectedCollection: IKeySkills[] = [keySkills, ...keySkillsCollection];
      jest.spyOn(keySkillsService, 'addKeySkillsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      expect(keySkillsService.query).toHaveBeenCalled();
      expect(keySkillsService.addKeySkillsToCollectionIfMissing).toHaveBeenCalledWith(keySkillsCollection, keySkills);
      expect(comp.keySkillsCollection).toEqual(expectedCollection);
    });

    it('Should call areaofInterest query and add missing value', () => {
      const resume: IResume = { id: 456 };
      const areaofInterest: IAreaofInterest = { id: 11170 };
      resume.areaofInterest = areaofInterest;

      const areaofInterestCollection: IAreaofInterest[] = [{ id: 68332 }];
      jest.spyOn(areaofInterestService, 'query').mockReturnValue(of(new HttpResponse({ body: areaofInterestCollection })));
      const expectedCollection: IAreaofInterest[] = [areaofInterest, ...areaofInterestCollection];
      jest.spyOn(areaofInterestService, 'addAreaofInterestToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      expect(areaofInterestService.query).toHaveBeenCalled();
      expect(areaofInterestService.addAreaofInterestToCollectionIfMissing).toHaveBeenCalledWith(areaofInterestCollection, areaofInterest);
      expect(comp.areaofInterestsCollection).toEqual(expectedCollection);
    });

    it('Should call socialLinks query and add missing value', () => {
      const resume: IResume = { id: 456 };
      const socialLinks: ISocialLinks = { id: 61151 };
      resume.socialLinks = socialLinks;

      const socialLinksCollection: ISocialLinks[] = [{ id: 79134 }];
      jest.spyOn(socialLinksService, 'query').mockReturnValue(of(new HttpResponse({ body: socialLinksCollection })));
      const expectedCollection: ISocialLinks[] = [socialLinks, ...socialLinksCollection];
      jest.spyOn(socialLinksService, 'addSocialLinksToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      expect(socialLinksService.query).toHaveBeenCalled();
      expect(socialLinksService.addSocialLinksToCollectionIfMissing).toHaveBeenCalledWith(socialLinksCollection, socialLinks);
      expect(comp.socialLinksCollection).toEqual(expectedCollection);
    });

    it('Should call internship query and add missing value', () => {
      const resume: IResume = { id: 456 };
      const internship: IInternship = { id: 71991 };
      resume.internship = internship;

      const internshipCollection: IInternship[] = [{ id: 13503 }];
      jest.spyOn(internshipService, 'query').mockReturnValue(of(new HttpResponse({ body: internshipCollection })));
      const expectedCollection: IInternship[] = [internship, ...internshipCollection];
      jest.spyOn(internshipService, 'addInternshipToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      expect(internshipService.query).toHaveBeenCalled();
      expect(internshipService.addInternshipToCollectionIfMissing).toHaveBeenCalledWith(internshipCollection, internship);
      expect(comp.internshipsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const resume: IResume = { id: 456 };
      const personalDetails: IPersonalDetails = { id: 3138 };
      resume.personalDetails = personalDetails;
      const workDetails: IWorkDetails = { id: 10301 };
      resume.workDetails = workDetails;
      const experienceDetails: IExperienceDetails = { id: 36794 };
      resume.experienceDetails = experienceDetails;
      const educationDetails: IEducationDetails = { id: 2656 };
      resume.educationDetails = educationDetails;
      const certificationDetails: ICertificationDetails = { id: 74176 };
      resume.certificationDetails = certificationDetails;
      const languages: ILanguages = { id: 51001 };
      resume.languages = languages;
      const keySkills: IKeySkills = { id: 63474 };
      resume.keySkills = keySkills;
      const areaofInterest: IAreaofInterest = { id: 99402 };
      resume.areaofInterest = areaofInterest;
      const socialLinks: ISocialLinks = { id: 2974 };
      resume.socialLinks = socialLinks;
      const internship: IInternship = { id: 23497 };
      resume.internship = internship;

      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(resume));
      expect(comp.personalDetailsCollection).toContain(personalDetails);
      expect(comp.workDetailsCollection).toContain(workDetails);
      expect(comp.experienceDetailsCollection).toContain(experienceDetails);
      expect(comp.educationDetailsCollection).toContain(educationDetails);
      expect(comp.certificationDetailsCollection).toContain(certificationDetails);
      expect(comp.languagesCollection).toContain(languages);
      expect(comp.keySkillsCollection).toContain(keySkills);
      expect(comp.areaofInterestsCollection).toContain(areaofInterest);
      expect(comp.socialLinksCollection).toContain(socialLinks);
      expect(comp.internshipsCollection).toContain(internship);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Resume>>();
      const resume = { id: 123 };
      jest.spyOn(resumeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: resume }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(resumeService.update).toHaveBeenCalledWith(resume);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Resume>>();
      const resume = new Resume();
      jest.spyOn(resumeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: resume }));
      saveSubject.complete();

      // THEN
      expect(resumeService.create).toHaveBeenCalledWith(resume);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Resume>>();
      const resume = { id: 123 };
      jest.spyOn(resumeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resume });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(resumeService.update).toHaveBeenCalledWith(resume);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPersonalDetailsById', () => {
      it('Should return tracked PersonalDetails primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPersonalDetailsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackWorkDetailsById', () => {
      it('Should return tracked WorkDetails primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackWorkDetailsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackExperienceDetailsById', () => {
      it('Should return tracked ExperienceDetails primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackExperienceDetailsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEducationDetailsById', () => {
      it('Should return tracked EducationDetails primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEducationDetailsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCertificationDetailsById', () => {
      it('Should return tracked CertificationDetails primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCertificationDetailsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackLanguagesById', () => {
      it('Should return tracked Languages primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLanguagesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackKeySkillsById', () => {
      it('Should return tracked KeySkills primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackKeySkillsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackAreaofInterestById', () => {
      it('Should return tracked AreaofInterest primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAreaofInterestById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSocialLinksById', () => {
      it('Should return tracked SocialLinks primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSocialLinksById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackInternshipById', () => {
      it('Should return tracked Internship primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackInternshipById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
