import { LangOptions } from 'app/entities/enumerations/lang-options.model';

export interface ILanguages {
  id?: number;
  langOption?: LangOptions | null;
}

export class Languages implements ILanguages {
  constructor(public id?: number, public langOption?: LangOptions | null) {}
}

export function getLanguagesIdentifier(languages: ILanguages): number | undefined {
  return languages.id;
}
