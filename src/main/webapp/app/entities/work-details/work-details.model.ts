import dayjs from 'dayjs/esm';

export interface IWorkDetails {
  id?: number;
  jobTitle?: string;
  position?: string | null;
  companyName?: string | null;
  city?: string | null;
  state?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  workSummary?: string | null;
}

export class WorkDetails implements IWorkDetails {
  constructor(
    public id?: number,
    public jobTitle?: string,
    public position?: string | null,
    public companyName?: string | null,
    public city?: string | null,
    public state?: string | null,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public workSummary?: string | null
  ) {}
}

export function getWorkDetailsIdentifier(workDetails: IWorkDetails): number | undefined {
  return workDetails.id;
}
