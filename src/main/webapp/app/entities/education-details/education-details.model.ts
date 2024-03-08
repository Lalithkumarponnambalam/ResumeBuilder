import dayjs from 'dayjs/esm';

export interface IEducationDetails {
  id?: number;
  schoolName?: string;
  city?: string | null;
  state?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  degree?: string | null;
  fieldofStudy?: string | null;
  graduationDate?: dayjs.Dayjs | null;
  educationSummary?: string | null;
}

export class EducationDetails implements IEducationDetails {
  constructor(
    public id?: number,
    public schoolName?: string,
    public city?: string | null,
    public state?: string | null,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public degree?: string | null,
    public fieldofStudy?: string | null,
    public graduationDate?: dayjs.Dayjs | null,
    public educationSummary?: string | null
  ) {}
}

export function getEducationDetailsIdentifier(educationDetails: IEducationDetails): number | undefined {
  return educationDetails.id;
}
