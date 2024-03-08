import dayjs from 'dayjs/esm';

export interface IInternship {
  id?: number;
  jobTitle?: string | null;
  employer?: string | null;
  companyName?: string | null;
  address?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  internshipSummary?: string | null;
}

export class Internship implements IInternship {
  constructor(
    public id?: number,
    public jobTitle?: string | null,
    public employer?: string | null,
    public companyName?: string | null,
    public address?: string | null,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public internshipSummary?: string | null
  ) {}
}

export function getInternshipIdentifier(internship: IInternship): number | undefined {
  return internship.id;
}
