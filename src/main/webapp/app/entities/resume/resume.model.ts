import { IPersonalDetails } from 'app/entities/personal-details/personal-details.model';
import { IWorkDetails } from 'app/entities/work-details/work-details.model';
import { IExperienceDetails } from 'app/entities/experience-details/experience-details.model';
import { IEducationDetails } from 'app/entities/education-details/education-details.model';
import { ICertificationDetails } from 'app/entities/certification-details/certification-details.model';
import { ILanguages } from 'app/entities/languages/languages.model';
import { IKeySkills } from 'app/entities/key-skills/key-skills.model';
import { IAreaofInterest } from 'app/entities/areaof-interest/areaof-interest.model';
import { ISocialLinks } from 'app/entities/social-links/social-links.model';
import { IInternship } from 'app/entities/internship/internship.model';

export interface IResume {
  id?: number;
  resumeSummary?: string | null;
  jobTitle?: string | null;
  personalDetails?: IPersonalDetails | null;
  workDetails?: IWorkDetails | null;
  experienceDetails?: IExperienceDetails | null;
  educationDetails?: IEducationDetails | null;
  certificationDetails?: ICertificationDetails | null;
  languages?: ILanguages | null;
  keySkills?: IKeySkills | null;
  areaofInterest?: IAreaofInterest | null;
  socialLinks?: ISocialLinks | null;
  internship?: IInternship | null;
}

export class Resume implements IResume {
  constructor(
    public id?: number,
    public resumeSummary?: string | null,
    public jobTitle?: string | null,
    public personalDetails?: IPersonalDetails | null,
    public workDetails?: IWorkDetails | null,
    public experienceDetails?: IExperienceDetails | null,
    public educationDetails?: IEducationDetails | null,
    public certificationDetails?: ICertificationDetails | null,
    public languages?: ILanguages | null,
    public keySkills?: IKeySkills | null,
    public areaofInterest?: IAreaofInterest | null,
    public socialLinks?: ISocialLinks | null,
    public internship?: IInternship | null
  ) {}
}

export function getResumeIdentifier(resume: IResume): number | undefined {
  return resume.id;
}
