export interface IAreaofInterest {
  id?: number;
  intrestSummary?: string | null;
}

export class AreaofInterest implements IAreaofInterest {
  constructor(public id?: number, public intrestSummary?: string | null) {}
}

export function getAreaofInterestIdentifier(areaofInterest: IAreaofInterest): number | undefined {
  return areaofInterest.id;
}
