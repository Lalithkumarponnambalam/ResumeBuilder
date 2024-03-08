import dayjs from 'dayjs/esm';

export interface ICertificationDetails {
  id?: number;
  certificateName?: string | null;
  institution?: string | null;
  certificateDate?: dayjs.Dayjs | null;
  certificationSummary?: string | null;
}

export class CertificationDetails implements ICertificationDetails {
  constructor(
    public id?: number,
    public certificateName?: string | null,
    public institution?: string | null,
    public certificateDate?: dayjs.Dayjs | null,
    public certificationSummary?: string | null
  ) {}
}

export function getCertificationDetailsIdentifier(certificationDetails: ICertificationDetails): number | undefined {
  return certificationDetails.id;
}
