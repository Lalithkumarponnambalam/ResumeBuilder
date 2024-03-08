export interface ISocialLinks {
  id?: number;
  lable?: string | null;
  link?: string | null;
}

export class SocialLinks implements ISocialLinks {
  constructor(public id?: number, public lable?: string | null, public link?: string | null) {}
}

export function getSocialLinksIdentifier(socialLinks: ISocialLinks): number | undefined {
  return socialLinks.id;
}
