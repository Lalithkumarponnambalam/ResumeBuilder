import dayjs from 'dayjs/esm';

export interface IExperienceDetails {
  id?: number;
  positionTitle?: string | null;
  companyName?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  workSummary?: string | null;
}

export class ExperienceDetails implements IExperienceDetails {
  constructor(
    public id?: number,
    public positionTitle?: string | null,
    public companyName?: string | null,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public workSummary?: string | null
  ) {}
}

export function getExperienceDetailsIdentifier(experienceDetails: IExperienceDetails): number | undefined {
  return experienceDetails.id;
}
