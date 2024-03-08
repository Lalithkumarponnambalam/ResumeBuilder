export interface IPersonalDetails {
  id?: number;
  profilePhotoContentType?: string | null;
  profilePhoto?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
}

export class PersonalDetails implements IPersonalDetails {
  constructor(
    public id?: number,
    public profilePhotoContentType?: string | null,
    public profilePhoto?: string | null,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public phone?: string | null,
    public address?: string | null,
    public city?: string | null,
    public state?: string | null,
    public zipCode?: string | null,
    public country?: string | null
  ) {}
}

export function getPersonalDetailsIdentifier(personalDetails: IPersonalDetails): number | undefined {
  return personalDetails.id;
}
