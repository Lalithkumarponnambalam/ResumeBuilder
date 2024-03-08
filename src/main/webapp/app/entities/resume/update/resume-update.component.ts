import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IResume, Resume } from '../resume.model';
import { ResumeService } from '../service/resume.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
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

@Component({
  selector: 'jhi-resume-update',
  templateUrl: './resume-update.component.html',
})
export class ResumeUpdateComponent implements OnInit {
  isSaving = false;

  personalDetailsCollection: IPersonalDetails[] = [];
  workDetailsCollection: IWorkDetails[] = [];
  experienceDetailsCollection: IExperienceDetails[] = [];
  educationDetailsCollection: IEducationDetails[] = [];
  certificationDetailsCollection: ICertificationDetails[] = [];
  languagesCollection: ILanguages[] = [];
  keySkillsCollection: IKeySkills[] = [];
  areaofInterestsCollection: IAreaofInterest[] = [];
  socialLinksCollection: ISocialLinks[] = [];
  internshipsCollection: IInternship[] = [];

  editForm = this.fb.group({
    id: [],
    resumeSummary: [],
    jobTitle: [],
    personalDetails: [],
    workDetails: [],
    experienceDetails: [],
    educationDetails: [],
    certificationDetails: [],
    languages: [],
    keySkills: [],
    areaofInterest: [],
    socialLinks: [],
    internship: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected resumeService: ResumeService,
    protected personalDetailsService: PersonalDetailsService,
    protected workDetailsService: WorkDetailsService,
    protected experienceDetailsService: ExperienceDetailsService,
    protected educationDetailsService: EducationDetailsService,
    protected certificationDetailsService: CertificationDetailsService,
    protected languagesService: LanguagesService,
    protected keySkillsService: KeySkillsService,
    protected areaofInterestService: AreaofInterestService,
    protected socialLinksService: SocialLinksService,
    protected internshipService: InternshipService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ resume }) => {
      this.updateForm(resume);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('resumeApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resume = this.createFromForm();
    if (resume.id !== undefined) {
      this.subscribeToSaveResponse(this.resumeService.update(resume));
    } else {
      this.subscribeToSaveResponse(this.resumeService.create(resume));
    }
  }

  trackPersonalDetailsById(_index: number, item: IPersonalDetails): number {
    return item.id!;
  }

  trackWorkDetailsById(_index: number, item: IWorkDetails): number {
    return item.id!;
  }

  trackExperienceDetailsById(_index: number, item: IExperienceDetails): number {
    return item.id!;
  }

  trackEducationDetailsById(_index: number, item: IEducationDetails): number {
    return item.id!;
  }

  trackCertificationDetailsById(_index: number, item: ICertificationDetails): number {
    return item.id!;
  }

  trackLanguagesById(_index: number, item: ILanguages): number {
    return item.id!;
  }

  trackKeySkillsById(_index: number, item: IKeySkills): number {
    return item.id!;
  }

  trackAreaofInterestById(_index: number, item: IAreaofInterest): number {
    return item.id!;
  }

  trackSocialLinksById(_index: number, item: ISocialLinks): number {
    return item.id!;
  }

  trackInternshipById(_index: number, item: IInternship): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResume>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(resume: IResume): void {
    this.editForm.patchValue({
      id: resume.id,
      resumeSummary: resume.resumeSummary,
      jobTitle: resume.jobTitle,
      personalDetails: resume.personalDetails,
      workDetails: resume.workDetails,
      experienceDetails: resume.experienceDetails,
      educationDetails: resume.educationDetails,
      certificationDetails: resume.certificationDetails,
      languages: resume.languages,
      keySkills: resume.keySkills,
      areaofInterest: resume.areaofInterest,
      socialLinks: resume.socialLinks,
      internship: resume.internship,
    });

    this.personalDetailsCollection = this.personalDetailsService.addPersonalDetailsToCollectionIfMissing(
      this.personalDetailsCollection,
      resume.personalDetails
    );
    this.workDetailsCollection = this.workDetailsService.addWorkDetailsToCollectionIfMissing(
      this.workDetailsCollection,
      resume.workDetails
    );
    this.experienceDetailsCollection = this.experienceDetailsService.addExperienceDetailsToCollectionIfMissing(
      this.experienceDetailsCollection,
      resume.experienceDetails
    );
    this.educationDetailsCollection = this.educationDetailsService.addEducationDetailsToCollectionIfMissing(
      this.educationDetailsCollection,
      resume.educationDetails
    );
    this.certificationDetailsCollection = this.certificationDetailsService.addCertificationDetailsToCollectionIfMissing(
      this.certificationDetailsCollection,
      resume.certificationDetails
    );
    this.languagesCollection = this.languagesService.addLanguagesToCollectionIfMissing(this.languagesCollection, resume.languages);
    this.keySkillsCollection = this.keySkillsService.addKeySkillsToCollectionIfMissing(this.keySkillsCollection, resume.keySkills);
    this.areaofInterestsCollection = this.areaofInterestService.addAreaofInterestToCollectionIfMissing(
      this.areaofInterestsCollection,
      resume.areaofInterest
    );
    this.socialLinksCollection = this.socialLinksService.addSocialLinksToCollectionIfMissing(
      this.socialLinksCollection,
      resume.socialLinks
    );
    this.internshipsCollection = this.internshipService.addInternshipToCollectionIfMissing(this.internshipsCollection, resume.internship);
  }

  protected loadRelationshipsOptions(): void {
    this.personalDetailsService
      .query({ filter: 'resume-is-null' })
      .pipe(map((res: HttpResponse<IPersonalDetails[]>) => res.body ?? []))
      .pipe(
        map((personalDetails: IPersonalDetails[]) =>
          this.personalDetailsService.addPersonalDetailsToCollectionIfMissing(personalDetails, this.editForm.get('personalDetails')!.value)
        )
      )
      .subscribe((personalDetails: IPersonalDetails[]) => (this.personalDetailsCollection = personalDetails));

    this.workDetailsService
      .query({ filter: 'resume-is-null' })
      .pipe(map((res: HttpResponse<IWorkDetails[]>) => res.body ?? []))
      .pipe(
        map((workDetails: IWorkDetails[]) =>
          this.workDetailsService.addWorkDetailsToCollectionIfMissing(workDetails, this.editForm.get('workDetails')!.value)
        )
      )
      .subscribe((workDetails: IWorkDetails[]) => (this.workDetailsCollection = workDetails));

    this.experienceDetailsService
      .query({ filter: 'resume-is-null' })
      .pipe(map((res: HttpResponse<IExperienceDetails[]>) => res.body ?? []))
      .pipe(
        map((experienceDetails: IExperienceDetails[]) =>
          this.experienceDetailsService.addExperienceDetailsToCollectionIfMissing(
            experienceDetails,
            this.editForm.get('experienceDetails')!.value
          )
        )
      )
      .subscribe((experienceDetails: IExperienceDetails[]) => (this.experienceDetailsCollection = experienceDetails));

    this.educationDetailsService
      .query({ filter: 'resume-is-null' })
      .pipe(map((res: HttpResponse<IEducationDetails[]>) => res.body ?? []))
      .pipe(
        map((educationDetails: IEducationDetails[]) =>
          this.educationDetailsService.addEducationDetailsToCollectionIfMissing(
            educationDetails,
            this.editForm.get('educationDetails')!.value
          )
        )
      )
      .subscribe((educationDetails: IEducationDetails[]) => (this.educationDetailsCollection = educationDetails));

    this.certificationDetailsService
      .query({ filter: 'resume-is-null' })
      .pipe(map((res: HttpResponse<ICertificationDetails[]>) => res.body ?? []))
      .pipe(
        map((certificationDetails: ICertificationDetails[]) =>
          this.certificationDetailsService.addCertificationDetailsToCollectionIfMissing(
            certificationDetails,
            this.editForm.get('certificationDetails')!.value
          )
        )
      )
      .subscribe((certificationDetails: ICertificationDetails[]) => (this.certificationDetailsCollection = certificationDetails));

    this.languagesService
      .query({ filter: 'resume-is-null' })
      .pipe(map((res: HttpResponse<ILanguages[]>) => res.body ?? []))
      .pipe(
        map((languages: ILanguages[]) =>
          this.languagesService.addLanguagesToCollectionIfMissing(languages, this.editForm.get('languages')!.value)
        )
      )
      .subscribe((languages: ILanguages[]) => (this.languagesCollection = languages));

    this.keySkillsService
      .query({ filter: 'resume-is-null' })
      .pipe(map((res: HttpResponse<IKeySkills[]>) => res.body ?? []))
      .pipe(
        map((keySkills: IKeySkills[]) =>
          this.keySkillsService.addKeySkillsToCollectionIfMissing(keySkills, this.editForm.get('keySkills')!.value)
        )
      )
      .subscribe((keySkills: IKeySkills[]) => (this.keySkillsCollection = keySkills));

    this.areaofInterestService
      .query({ filter: 'resume-is-null' })
      .pipe(map((res: HttpResponse<IAreaofInterest[]>) => res.body ?? []))
      .pipe(
        map((areaofInterests: IAreaofInterest[]) =>
          this.areaofInterestService.addAreaofInterestToCollectionIfMissing(areaofInterests, this.editForm.get('areaofInterest')!.value)
        )
      )
      .subscribe((areaofInterests: IAreaofInterest[]) => (this.areaofInterestsCollection = areaofInterests));

    this.socialLinksService
      .query({ filter: 'resume-is-null' })
      .pipe(map((res: HttpResponse<ISocialLinks[]>) => res.body ?? []))
      .pipe(
        map((socialLinks: ISocialLinks[]) =>
          this.socialLinksService.addSocialLinksToCollectionIfMissing(socialLinks, this.editForm.get('socialLinks')!.value)
        )
      )
      .subscribe((socialLinks: ISocialLinks[]) => (this.socialLinksCollection = socialLinks));

    this.internshipService
      .query({ filter: 'resume-is-null' })
      .pipe(map((res: HttpResponse<IInternship[]>) => res.body ?? []))
      .pipe(
        map((internships: IInternship[]) =>
          this.internshipService.addInternshipToCollectionIfMissing(internships, this.editForm.get('internship')!.value)
        )
      )
      .subscribe((internships: IInternship[]) => (this.internshipsCollection = internships));
  }

  protected createFromForm(): IResume {
    return {
      ...new Resume(),
      id: this.editForm.get(['id'])!.value,
      resumeSummary: this.editForm.get(['resumeSummary'])!.value,
      jobTitle: this.editForm.get(['jobTitle'])!.value,
      personalDetails: this.editForm.get(['personalDetails'])!.value,
      workDetails: this.editForm.get(['workDetails'])!.value,
      experienceDetails: this.editForm.get(['experienceDetails'])!.value,
      educationDetails: this.editForm.get(['educationDetails'])!.value,
      certificationDetails: this.editForm.get(['certificationDetails'])!.value,
      languages: this.editForm.get(['languages'])!.value,
      keySkills: this.editForm.get(['keySkills'])!.value,
      areaofInterest: this.editForm.get(['areaofInterest'])!.value,
      socialLinks: this.editForm.get(['socialLinks'])!.value,
      internship: this.editForm.get(['internship'])!.value,
    };
  }
}
