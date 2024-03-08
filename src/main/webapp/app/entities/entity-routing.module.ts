import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'resume',
        data: { pageTitle: 'resumeApp.resume.home.title' },
        loadChildren: () => import('./resume/resume.module').then(m => m.ResumeModule),
      },
      {
        path: 'personal-details',
        data: { pageTitle: 'resumeApp.personalDetails.home.title' },
        loadChildren: () => import('./personal-details/personal-details.module').then(m => m.PersonalDetailsModule),
      },
      {
        path: 'work-details',
        data: { pageTitle: 'resumeApp.workDetails.home.title' },
        loadChildren: () => import('./work-details/work-details.module').then(m => m.WorkDetailsModule),
      },
      {
        path: 'experience-details',
        data: { pageTitle: 'resumeApp.experienceDetails.home.title' },
        loadChildren: () => import('./experience-details/experience-details.module').then(m => m.ExperienceDetailsModule),
      },
      {
        path: 'education-details',
        data: { pageTitle: 'resumeApp.educationDetails.home.title' },
        loadChildren: () => import('./education-details/education-details.module').then(m => m.EducationDetailsModule),
      },
      {
        path: 'key-skills',
        data: { pageTitle: 'resumeApp.keySkills.home.title' },
        loadChildren: () => import('./key-skills/key-skills.module').then(m => m.KeySkillsModule),
      },
      {
        path: 'certification-details',
        data: { pageTitle: 'resumeApp.certificationDetails.home.title' },
        loadChildren: () => import('./certification-details/certification-details.module').then(m => m.CertificationDetailsModule),
      },
      {
        path: 'languages',
        data: { pageTitle: 'resumeApp.languages.home.title' },
        loadChildren: () => import('./languages/languages.module').then(m => m.LanguagesModule),
      },
      {
        path: 'areaof-interest',
        data: { pageTitle: 'resumeApp.areaofInterest.home.title' },
        loadChildren: () => import('./areaof-interest/areaof-interest.module').then(m => m.AreaofInterestModule),
      },
      {
        path: 'social-links',
        data: { pageTitle: 'resumeApp.socialLinks.home.title' },
        loadChildren: () => import('./social-links/social-links.module').then(m => m.SocialLinksModule),
      },
      {
        path: 'internship',
        data: { pageTitle: 'resumeApp.internship.home.title' },
        loadChildren: () => import('./internship/internship.module').then(m => m.InternshipModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
