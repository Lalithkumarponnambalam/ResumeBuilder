export interface IKeySkills {
  id?: number;
  keySkillsSummary?: string | null;
}

export class KeySkills implements IKeySkills {
  constructor(public id?: number, public keySkillsSummary?: string | null) {}
}

export function getKeySkillsIdentifier(keySkills: IKeySkills): number | undefined {
  return keySkills.id;
}
